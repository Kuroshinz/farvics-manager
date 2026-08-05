'use client';
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Typography } from '../../ui/typography/Typography';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <nav className="flex items-center space-x-2 text-xs font-medium text-content-muted">
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={12} className="opacity-50" />}
              <span className={idx === breadcrumbs.length - 1 ? 'text-white' : 'hover:text-white transition-colors cursor-pointer'}>
                {bc.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Typography variant="h1" className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50 tracking-tight">
            {title}
          </Typography>
          {description && (
            <Typography variant="body" className="mt-1 text-content-secondary max-w-2xl leading-relaxed">
              {description}
            </Typography>
          )}
        </motion.div>
      </div>
      {action && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
          {action}
        </motion.div>
      )}
    </div>
  );
}
