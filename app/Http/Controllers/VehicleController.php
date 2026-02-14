<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleIndexRequest;
use App\Http\Requests\VehicleStoreRequest;
use App\Models\VehicleCategory;
use App\Services\VehicleMakeService;
use App\Services\VehicleModelService;
use App\Services\VehicleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct(
        protected VehicleService $vehicleService,
        protected VehicleMakeService $vehicleMakeService,
        protected VehicleModelService $vehicleModelService,
    ) {}

    public function index(VehicleIndexRequest $request): Response
    {
        $dto = $request->toDTO();

        return Inertia::render('vehicles/index', [
            'vehicles' => $this->vehicleService->getVehicles($dto),
            'makes' => $this->vehicleMakeService->getAll(),
            'selectedMakeId' => $dto->makeId,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vehicles/create', [
            'makes' => $this->vehicleMakeService->getAll(),
            'categories' => VehicleCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function store(VehicleStoreRequest $request): RedirectResponse
    {
        $this->vehicleService->create($request->validated());

        return redirect()->route('vehicles.index');
    }
}
