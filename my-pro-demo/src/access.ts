export default function access(
  initialState: { currentUser?: { name?: string; userid?: string } } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: !!currentUser,
  };
}
