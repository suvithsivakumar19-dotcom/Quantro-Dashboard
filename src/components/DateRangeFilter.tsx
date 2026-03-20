import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { CalendarDays, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DateRangeFilter() {
  const { state, dispatch } = useApp();

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="w-4 h-4 text-muted-foreground" />
      <Input
        type="date"
        value={state.dateRange.from || ''}
        onChange={e => dispatch({ type: 'SET_DATE_RANGE', payload: { ...state.dateRange, from: e.target.value || null } })}
        className="h-8 w-36 text-xs"
        placeholder="From"
      />
      <span className="text-muted-foreground text-xs">to</span>
      <Input
        type="date"
        value={state.dateRange.to || ''}
        onChange={e => dispatch({ type: 'SET_DATE_RANGE', payload: { ...state.dateRange, to: e.target.value || null } })}
        className="h-8 w-36 text-xs"
        placeholder="To"
      />
      {(state.dateRange.from || state.dateRange.to) && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => dispatch({ type: 'SET_DATE_RANGE', payload: { from: null, to: null } })}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
