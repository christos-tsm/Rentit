<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeasonStoreRequest;
use App\Http\Requests\SeasonUpdateRequest;
use App\Models\Season;
use App\Models\VehicleCategory;
use App\Services\SeasonService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SeasonController extends Controller
{
    public function __construct(
        protected SeasonService $seasonService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/seasons/index', [
            'seasons' => $this->seasonService->getAll(),
            'categories' => VehicleCategory::query()->orderBy('name')->get(),
        ]);
    }

    public function store(SeasonStoreRequest $request): RedirectResponse
    {
        $this->seasonService->create($request->validated());

        return back()->with('success', 'Season created successfully.');
    }

    public function update(SeasonUpdateRequest $request, Season $season): RedirectResponse
    {
        $this->seasonService->update($season, $request->validated());

        return back()->with('success', 'Season updated successfully.');
    }

    public function destroy(Season $season): RedirectResponse
    {
        $this->seasonService->delete($season);

        return back()->with('success', 'Season deleted successfully.');
    }
}
