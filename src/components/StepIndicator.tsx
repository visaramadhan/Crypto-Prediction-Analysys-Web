import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface StepIndicatorProps {
  steps: {
    id: string;
    title: string;
    status: 'completed' | 'active' | 'pending' | 'error';
    description: string;
  }[];
  currentStep: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Pipeline</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {step.status === 'completed' && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
              {step.status === 'active' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">{index + 1}</span>
                </div>
              )}
              {step.status === 'error' && (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.status === 'active' ? 'text-blue-600' : 
                step.status === 'completed' ? 'text-green-600' : 
                step.status === 'error' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {step.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;