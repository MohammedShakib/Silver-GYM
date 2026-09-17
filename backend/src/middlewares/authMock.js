export const authMock = (req, res, next) => {
  // Simple mock auth for Phase 3
  const demoMemberId = process.env.DEMO_MEMBER_ID || 'SG-2048-DA';
  req.memberId = demoMemberId; // Simulate authenticated user ID
  next();
};
