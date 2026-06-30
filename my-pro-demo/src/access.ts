export default function access(
  initialState:
    | { currentUser?: { name?: string; userid?: string; access?: string } }
    | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser?.access === 'admin',
  };
}
