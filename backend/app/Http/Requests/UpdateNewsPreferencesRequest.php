<?php

namespace App\Http\Requests;

use App\Traits\Validation\FailedValidationResponse;
use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsPreferencesRequest extends FormRequest
{
    use FailedValidationResponse;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'sources' => ['nullable', 'array'],
            'sources.*.label' => ['required', 'string'],
            'sources.*.value' => ['required', 'string'],

            'categories' => ['nullable', 'array'],
            'categories.*.label' => ['required', 'string'],
            'categories.*.value' => ['required', 'string'],

            'authors' => ['nullable', 'array'],
            'authors.*.label' => ['required', 'string'],
            'authors.*.value' => ['required', 'string'],
        ];
    }
}
