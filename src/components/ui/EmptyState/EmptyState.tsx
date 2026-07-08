import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../Button/Button';
import './EmptyState.css';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'No products found',
  description = "We couldn't find any items matching your criteria.",
  actionText = 'Continue Shopping',
  onActionClick,
  icon,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="empty-state-container">
      <div className="empty-state-backdrop-glow"></div>
      <div className="empty-state-card">
        <div className="empty-state-icon-wrapper">
          <div className="empty-state-icon-glow"></div>
          <div className="empty-state-icon-inner">
            {icon || <ShoppingBag className="empty-state-default-icon" size={32} />}
          </div>
        </div>
        
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-description">{description}</p>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleAction}
          className="empty-state-action-btn"
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}
