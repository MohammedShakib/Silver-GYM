import { MockGymRepository } from './MockGymRepository';
import { MockMemberRepository } from './MockMemberRepository';
import { MockMembershipRepository } from './MockMembershipRepository';
import { MockCheckInRepository } from './MockCheckInRepository';

import { ApiGymRepository } from './ApiGymRepository';
import { ApiMemberRepository } from './ApiMemberRepository';
import { ApiMembershipRepository } from './ApiMembershipRepository';
import { ApiCheckInRepository } from './ApiCheckInRepository';

const isApiMode = import.meta.env.VITE_DATA_MODE === 'api';

// Create instances for Mock
const mockGymRepo = new MockGymRepository();
const mockMemberRepo = new MockMemberRepository();
const mockMembershipRepo = new MockMembershipRepository();
const mockCheckInRepo = new MockCheckInRepository();

export const gymRepository = isApiMode ? ApiGymRepository : mockGymRepo;
export const memberRepository = isApiMode ? ApiMemberRepository : mockMemberRepo;
export const membershipRepository = isApiMode ? ApiMembershipRepository : mockMembershipRepo;
export const checkInRepository = isApiMode ? ApiCheckInRepository : mockCheckInRepo;
