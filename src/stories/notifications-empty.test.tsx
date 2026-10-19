import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NotificationsEmpty } from './notifications-empty.stories';

describe('NotificationsEmpty', () => {
  describe('error state', () => {
    it('exposes the alert role and error test id', () => {
      render(<NotificationsEmpty status="error" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByTestId('notifications-error')).toBeInTheDocument();
    });

    it('renders the correlation id when provided', () => {
      render(<NotificationsEmpty status="error" correlationId="corr-123" />);

      expect(screen.getByText(/corr-123/)).toBeInTheDocument();
    });

    it('does not render a correlation id when omitted', () => {
      render(<NotificationsEmpty status="error" />);

      expect(screen.queryByText(/corr-123/)).not.toBeInTheDocument();
    });

    it('calls onRetry exactly once when the retry button is clicked', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(<NotificationsEmpty status="error" onRetry={onRetry} />);

      await user.click(screen.getByRole('button', { name: /try again/i }));

      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('empty state', () => {
    it('exposes the status role and empty test id', () => {
      render(<NotificationsEmpty status="empty" />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByTestId('notifications-empty')).toBeInTheDocument();
    });

    it('never renders the retry button', () => {
      render(<NotificationsEmpty status="empty" onRetry={vi.fn()} />);

      expect(
        screen.queryByRole('button', { name: /try again/i }),
      ).not.toBeInTheDocument();
    });
  });
});
