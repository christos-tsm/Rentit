<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerStoreRequest;
use App\Http\Requests\CustomerUpdateRequest;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        protected CustomerService $customerService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/customers/index', [
            'customers' => $this->customerService->getAll(),
        ]);
    }

    public function store(CustomerStoreRequest $request): RedirectResponse
    {
        $this->customerService->create($request->validated());

        return back()->with('success', 'Ο πελάτης δημιουργήθηκε με επιτυχία.');
    }

    public function update(CustomerUpdateRequest $request, Customer $customer): RedirectResponse
    {
        $this->customerService->update($customer, $request->validated());

        return back()->with('success', 'Ο πελάτης ενημερώθηκε με επιτυχία.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $this->customerService->delete($customer);

        return back()->with('success', 'Ο πελάτης διαγράφηκε με επιτυχία.');
    }
}
