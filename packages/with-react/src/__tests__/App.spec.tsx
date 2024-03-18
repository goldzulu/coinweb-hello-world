import { vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import * as hooks from '../hooks';

describe('App component', () => {
  let fetchClaimsMock = vi.fn();
  let validateClaimMock = vi.fn();

  const mockGreeting = {
    firstKey: 'test',
    secondKey: 'claim',
    body: 'Claim body content',
  };

  beforeEach(() => {
    vi.useFakeTimers();

    fetchClaimsMock = vi.fn();
    validateClaimMock = vi.fn();

    vi.spyOn(hooks, 'useGreeting').mockReturnValue({
      fetch: fetchClaimsMock,
      validate: validateClaimMock,
      greeting: mockGreeting,
      contractId: '123',
      isValid: undefined,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the header with logos', () => {
    render(<App />);
    const coinwebLogo = screen.getByAltText('Coinweb logo');
    const reactLogo = screen.getByAltText('React logo');
    expect(coinwebLogo).toBeInTheDocument();
    expect(reactLogo).toBeInTheDocument();
  });

  it('renders the main content area', () => {
    render(<App />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Contract ID')).toBeInTheDocument();
  });

  it('loads App with the validation form', async () => {
    render(<App />);

    expect(fetchClaimsMock).toHaveBeenCalled();

    expect(screen.queryByText(/Claim body/)).toBeInTheDocument();
    expect(screen.queryByText(/First key/)).toBeInTheDocument();
    expect(screen.queryByText(/Second key/)).toBeInTheDocument();
  });

  it('renders App without the validation form', async () => {
    vi.spyOn(hooks, 'useGreeting').mockReturnValue({
      fetch: fetchClaimsMock,
      validate: validateClaimMock,
      greeting: undefined,
      contractId: '',
      isValid: undefined,
      isLoading: true,
    });

    const { container } = render(<App />);

    expect(fetchClaimsMock).toHaveBeenCalled();

    expect(screen.queryByText(/Claim body/)).not.toBeInTheDocument();
    expect(screen.queryByText(/First key/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Second key/)).not.toBeInTheDocument();

    expect(container.getElementsByClassName('loader')).toBeDefined();
  });

  it('form is visible and user clicks on the button, then the Valid claim message is displayed', async () => {
    vi.spyOn(hooks, 'useGreeting').mockReturnValue({
      fetch: fetchClaimsMock,
      validate: validateClaimMock,
      greeting: mockGreeting,
      contractId: '',
      isValid: true,
      isLoading: false,
    });

    render(<App />);

    // Check if the form is visible
    const firstKeyInput = screen.getByText(/First key/i);
    const secondKeyInput = screen.getByText(/Second key/i);
    const claimBodyInput = screen.getByText(/Claim body/i);
    const submitButton = screen.getByRole('button', { name: /Validate claim/i });
    expect(firstKeyInput).toBeVisible();
    expect(secondKeyInput).toBeVisible();
    expect(claimBodyInput).toBeVisible();
    expect(submitButton).toBeVisible();

    fireEvent.click(submitButton);

    expect(validateClaimMock).toHaveBeenCalledTimes(1);

    expect(screen.queryByText(/Claim is valid/i)).toBeVisible();
    expect(screen.queryByText(/Claim is invalid/i)).not.toBeInTheDocument();
  });
});
