<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExtraStoreRequest;
use App\Http\Requests\ExtraUpdateRequest;
use App\Models\Extra;
use App\Services\ExtraService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExtraController extends Controller
{
    public function __construct(
        protected ExtraService $extraService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/extras/index', [
            'extras' => $this->extraService->getAll(),
        ]);
    }

    public function store(ExtraStoreRequest $request): RedirectResponse
    {
        $this->extraService->create($request->validated());

        return back()->with('success', 'Extra created successfully.');
    }

    public function update(ExtraUpdateRequest $request, Extra $extra): RedirectResponse
    {
        $this->extraService->update($extra, $request->validated());

        return back()->with('success', 'Extra updated successfully.');
    }

    public function destroy(Extra $extra): RedirectResponse
    {
        $this->extraService->delete($extra);

        return back()->with('success', 'Extra deleted successfully.');
    }
}
