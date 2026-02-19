<?php

namespace App\Http\Controllers;

use App\Http\Requests\LocationStoreRequest;
use App\Http\Requests\LocationUpdateRequest;
use App\Models\Location;
use App\Services\LocationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function __construct(
        protected LocationService $locationService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/locations/index', [
            'locations' => $this->locationService->getAll(),
        ]);
    }

    public function store(LocationStoreRequest $request): RedirectResponse
    {
        $this->locationService->create($request->validated());

        return back()->with('success', 'Η τοποθεσία δημιουργήθηκε με επιτυχία.');
    }

    public function update(LocationUpdateRequest $request, Location $location): RedirectResponse
    {
        $this->locationService->update($location, $request->validated());

        return back()->with('success', 'Η τοποθεσία ενημερώθηκε με επιτυχία.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $this->locationService->delete($location);

        return back()->with('success', 'Η τοποθεσία διαγράφηκε με επιτυχία.');
    }
}
