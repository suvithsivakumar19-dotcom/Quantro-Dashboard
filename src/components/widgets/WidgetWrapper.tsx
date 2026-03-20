import { motion } from 'framer-motion';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { ReactNode } from 'react';

interface WidgetWrapperProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WidgetWrapper({ title, children, onEdit, onDelete }: WidgetWrapperProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card-hover h-full w-full flex flex-col group cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">{title}</h3>
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          {onEdit && (
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onEdit}
              className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all duration-200"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={onDelete}
              className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
