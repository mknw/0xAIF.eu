import React from 'react';
import { Terminal, MessagesSquare, Calendar, BrainCircuit, Briefcase, HeartHandshake } from 'lucide-react';

const icons = {
  Terminal,
  MessagesSquare,
  Calendar,
  BrainCircuit,
  Briefcase,
  HeartHandshake,
};

type IconName = keyof typeof icons;

const FeatureItem = ({ iconName, children }: { iconName: IconName, children: React.ReactNode }) => {
  const Icon = icons[iconName];

  return (
    <li className="flex items-start gap-4">
      <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mt-1">
        {Icon && <Icon className="w-5 h-5 text-white" />}
      </div>
      <span className="pt-0.5">{children}</span>
    </li>
  );
};

export default FeatureItem;
