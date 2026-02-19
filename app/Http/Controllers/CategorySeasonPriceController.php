<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategorySeasonPriceStoreRequest;
use App\Http\Requests\CategorySeasonPriceUpdateRequest;
use App\Models\CategorySeasonPrice;
use Illuminate\Http\RedirectResponse;

class CategorySeasonPriceController extends Controller
{
    public function store(CategorySeasonPriceStoreRequest $request): RedirectResponse
    {
        CategorySeasonPrice::create($request->validated());

        return back()->with('success', 'Season price created successfully.');
    }

    public function update(CategorySeasonPriceUpdateRequest $request, CategorySeasonPrice $categorySeasonPrice): RedirectResponse
    {
        $categorySeasonPrice->update($request->validated());

        return back()->with('success', 'Season price updated successfully.');
    }
}
