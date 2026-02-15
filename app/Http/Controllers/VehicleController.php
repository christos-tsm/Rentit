<?php

namespace App\Http\Controllers;

use App\DTO\Requests\VehicleRequestDTO;
use App\Http\Requests\VehicleIndexRequest;
use App\Http\Requests\VehicleStoreRequest;
use App\Http\Requests\VehicleUpdateRequest;
use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Services\VehicleMakeService;
use App\Services\VehicleModelService;
use App\Services\VehicleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller {
    public function __construct(
        protected VehicleService $vehicleService,
        protected VehicleMakeService $vehicleMakeService,
        protected VehicleModelService $vehicleModelService,
    ) {
    }

    public function index(VehicleIndexRequest $request): Response {
        $dto = $request->toDTO();

        $dto->rpp ?? 5;
        return Inertia::render('vehicles/index', [
            'vehicles' => $this->vehicleService->getVehicles($dto),
            'makes' => $this->vehicleMakeService->getAll(),
            'categories' => VehicleCategory::query()->orderBy('name')->get(),
            'filters' => [
                'search' => $dto->searchKey,
                'make_id' => $dto->makeId,
                'category_id' => $dto->categoryId,
                'status' => $dto->status,
            ],
        ]);
    }

    public function create(): Response {
        return Inertia::render('vehicles/create', [
            'makes' => $this->vehicleMakeService->getAll(),
            'categories' => VehicleCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function store(VehicleStoreRequest $request): RedirectResponse {
        $this->vehicleService->create($request->validated());

        return redirect()->route('vehicles.index')->with('success', 'Το όχημα καταχωρήθηκε με επιτυχία.');
    }

    public function show(Vehicle $vehicle): Response {
        $dto = new VehicleRequestDTO(id: $vehicle->id);
        $vehicle = $this->vehicleService->getVehicle($dto);

        return Inertia::render('vehicles/show', [
            'vehicle' => $vehicle,
            'makes' => $this->vehicleMakeService->getAll(),
            'categories' => VehicleCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function update(VehicleUpdateRequest $request, Vehicle $vehicle): RedirectResponse {
        $this->vehicleService->update($vehicle, $request->validated());

        return redirect()->route('vehicles.index')->with('success', 'Το όχημα ενημερώθηκε με επιτυχία.');
    }
}
