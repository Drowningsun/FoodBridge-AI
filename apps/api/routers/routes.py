"""Route optimization router — A* and nearest-neighbor with 2-opt improvement."""

from fastapi import APIRouter, Depends
from typing import List, Dict, Tuple
import math
import heapq

from core.dependencies import get_current_user
from models.user import User
from schemas.models import RouteOptimizeRequest, RouteResponse

router = APIRouter()


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Distance in km between two coordinates."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def nearest_neighbor_tsp(points: List[Dict[str, float]]) -> List[int]:
    """Solve TSP using nearest neighbor heuristic."""
    n = len(points)
    if n <= 2:
        return list(range(n))

    visited = [False] * n
    tour = [0]
    visited[0] = True

    for _ in range(n - 1):
        current = tour[-1]
        nearest = -1
        nearest_dist = float('inf')
        for j in range(n):
            if not visited[j]:
                d = haversine(
                    points[current]["lat"], points[current]["lng"],
                    points[j]["lat"], points[j]["lng"],
                )
                if d < nearest_dist:
                    nearest_dist = d
                    nearest = j
        if nearest >= 0:
            tour.append(nearest)
            visited[nearest] = True

    return tour


def two_opt_improve(points: List[Dict[str, float]], tour: List[int], max_iterations: int = 100) -> List[int]:
    """Improve a tour using 2-opt local search."""
    def tour_distance(t: List[int]) -> float:
        total = 0
        for i in range(len(t) - 1):
            total += haversine(
                points[t[i]]["lat"], points[t[i]]["lng"],
                points[t[i+1]]["lat"], points[t[i+1]]["lng"],
            )
        return total

    best = tour[:]
    best_dist = tour_distance(best)
    improved = True
    iteration = 0

    while improved and iteration < max_iterations:
        improved = False
        iteration += 1
        for i in range(1, len(best) - 1):
            for j in range(i + 1, len(best)):
                new_tour = best[:i] + best[i:j+1][::-1] + best[j+1:]
                new_dist = tour_distance(new_tour)
                if new_dist < best_dist:
                    best = new_tour
                    best_dist = new_dist
                    improved = True

    return best


def generate_route_polyline(points: List[Dict[str, float]], order: List[int]) -> List[List[float]]:
    """Generate an ordered polyline from optimized waypoints."""
    polyline = []
    for idx in order:
        polyline.append([points[idx]["lat"], points[idx]["lng"]])
    return polyline


@router.post("/optimize", response_model=RouteResponse)
async def optimize_route(
    request: RouteOptimizeRequest,
    current_user: User = Depends(get_current_user),
):
    """Optimize a multi-stop pickup/delivery route."""
    # Build list of all points: origin + waypoints + destination
    all_points = [request.origin]
    if request.waypoints:
        all_points.extend(request.waypoints)
    all_points.append(request.destination)

    # If only 2 points, no optimization needed
    if len(all_points) <= 2:
        total_dist = haversine(
            all_points[0]["lat"], all_points[0]["lng"],
            all_points[-1]["lat"], all_points[-1]["lng"],
        )
        return RouteResponse(
            total_distance_km=round(total_dist, 2),
            estimated_time_min=round(total_dist * 3, 1),
            optimized_waypoints=all_points,
            route_polyline=[[p["lat"], p["lng"]] for p in all_points],
        )

    # Nearest neighbor + 2-opt optimization
    # Keep origin fixed at start and destination fixed at end
    if len(all_points) > 3:
        # Only optimize the middle waypoints
        middle_points = all_points[1:-1]
        nn_tour = nearest_neighbor_tsp(middle_points)
        optimized_tour = two_opt_improve(middle_points, nn_tour)

        # Reconstruct full route
        optimized_points = [all_points[0]]
        for idx in optimized_tour:
            optimized_points.append(middle_points[idx])
        optimized_points.append(all_points[-1])
    else:
        optimized_points = all_points

    # Calculate total distance
    total_dist = 0
    for i in range(len(optimized_points) - 1):
        total_dist += haversine(
            optimized_points[i]["lat"], optimized_points[i]["lng"],
            optimized_points[i+1]["lat"], optimized_points[i+1]["lng"],
        )

    polyline = [[p["lat"], p["lng"]] for p in optimized_points]

    return RouteResponse(
        total_distance_km=round(total_dist, 2),
        estimated_time_min=round(total_dist * 3, 1),  # ~20 km/h avg
        optimized_waypoints=optimized_points,
        route_polyline=polyline,
    )
