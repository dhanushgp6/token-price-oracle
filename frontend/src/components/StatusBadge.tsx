import React from 'react';
import { CheckCircle, Clock, Database, Zap } from 'lucide-react';

interface StatusBadgeProps {
  source: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ source }) => {
  const getStatusConfig = (source: string) => {
    switch (source) {
      case 'cache':
        return { icon: Zap, color: 'bg-yellow-100 text-yellow-800', label: 'Cached' };
      case 'database':
        return { icon: Database, color: 'bg-blue-100 text-blue-800', label: 'Database' };
      case 'alchemy':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Live API' };
      case 'interpolated':
        return { icon: Clock, color: 'bg-purple-100 text-purple-800', label: 'Interpolated' };
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-800', label: source };
    }
  };

  const { icon: Icon, color, label } = getStatusConfig(source);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};
