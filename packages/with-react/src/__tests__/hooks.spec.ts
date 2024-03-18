import { vi, Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as helloWorldCm from 'hello-world.cm';
import { useContractClaims } from '../hooks';

vi.mock('hello-world.cm', () => ({
  exampleApi: {
    fetchClaims: vi.fn(),
    validateClaim: vi.fn(),
  },
}));

describe('useContractClaims hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start with no claims and not loading', () => {
    const { result } = renderHook(() => useContractClaims());

    expect(result.current.claim).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should set isLoading to true when fetchClaims is called', async () => {
    const { result } = renderHook(() => useContractClaims());

    // do not await to test isLoading
    act(() => {
      result.current.fetchClaims();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('should fetch claims and update state accordingly', async () => {
    const mockClaims = [{ content: { key: { first_part: 'test', second_part: 'claim' } } }];

    (helloWorldCm.exampleApi.fetchClaims as Mock).mockResolvedValue({ result: mockClaims, status: 'success' });

    const { result, rerender } = renderHook(() => useContractClaims());

    await act(async () => {
      await result.current.fetchClaims();
    });

    rerender();

    expect(helloWorldCm.exampleApi.fetchClaims).toHaveBeenCalledTimes(1);
    expect(result.current.claim).toEqual(mockClaims[0]);
  });

  it('should validate claim and update isValid state', async () => {
    const mockClaim = {
      issuer: { FromContractId: 'test-contract-id' },
      content: { key: { first_part: 'test', second_part: 'claim' }, body: 'test', fees_stored: '0' },
    };

    (helloWorldCm.exampleApi.validateClaim as Mock).mockReturnValue(true);

    const { result } = renderHook(() => useContractClaims());

    act(() => {
      result.current.validateClaim(mockClaim);
    });

    expect(helloWorldCm.exampleApi.validateClaim).toHaveBeenCalledWith(mockClaim);
    expect(result.current.isValid).toBe(true);
  });
});
