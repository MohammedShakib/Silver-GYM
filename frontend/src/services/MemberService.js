import { memberRepository } from '../data/repositories/MockMemberRepository';

class MemberService {
  async getCurrentMember(userId) {
    return memberRepository.getMember(userId);
  }

  async updateProfile(userId, data) {
    return memberRepository.updateMember(userId, data);
  }

  async updatePreferences(userId, prefs) {
    const member = await memberRepository.getMember(userId);
    return memberRepository.updateMember(userId, {
      preferences: { ...(member.preferences || {}), ...prefs }
    });
  }

  async getSavedGyms(userId) {
    return memberRepository.getSavedGyms(userId);
  }

  async toggleSavedGym(userId, gymId) {
    return memberRepository.toggleSavedGym(userId, gymId);
  }
}

export const memberService = new MemberService();
