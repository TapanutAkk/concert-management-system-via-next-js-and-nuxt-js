'use client';

import { Save, User } from 'lucide-react';
import React from 'react';

export default function ConcertForm() {

    return (
        <div className="py-6 border-b border-gray-200 last:border-b-0">
          <h3 className="text-3xl font-semibold text-blue-600 border-b-1 border-gray-300 pb-4 mb-4">
              Create
          </h3>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="concert-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Concert Name
                </label>
                <input
                  type="text"
                  id="concert-name"
                  name="concertName"
                  placeholder="Please input concert name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="total-seat" className="block text-sm font-medium text-gray-700 mb-1">
                  Total of seat
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    id="total-seat"
                    name="totalSeat"
                    defaultValue="500"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 pr-10 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Please input description"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="h-5 w-5 mr-2" />
                Save
              </button>
            </div>
          </form>
        </div>
    );
}