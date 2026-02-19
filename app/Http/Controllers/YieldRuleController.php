<?php

namespace App\Http\Controllers;

use App\Http\Requests\YieldRuleStoreRequest;
use App\Http\Requests\YieldRuleUpdateRequest;
use App\Models\YieldRule;
use App\Services\YieldRuleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class YieldRuleController extends Controller
{
    public function __construct(
        protected YieldRuleService $yieldRuleService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pricing/yield-rules/index', [
            'yield_rules' => $this->yieldRuleService->getAll(),
        ]);
    }

    public function store(YieldRuleStoreRequest $request): RedirectResponse
    {
        $this->yieldRuleService->create($request->validated());

        return back()->with('success', 'Yield rule created successfully.');
    }

    public function update(YieldRuleUpdateRequest $request, YieldRule $yieldRule): RedirectResponse
    {
        $this->yieldRuleService->update($yieldRule, $request->validated());

        return back()->with('success', 'Yield rule updated successfully.');
    }

    public function destroy(YieldRule $yieldRule): RedirectResponse
    {
        $this->yieldRuleService->delete($yieldRule);

        return back()->with('success', 'Yield rule deleted successfully.');
    }
}
