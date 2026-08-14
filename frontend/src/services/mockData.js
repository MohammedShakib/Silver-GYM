export const mockUser = {
  name: 'Alex Rahman',
  id: 'FP-2048-DA',
  tier: 'Active',
  location: 'Mirpur 10, Dhaka',
  visitsRemaining: 3,
  totalVisits: 15,
  renewalDate: '30 August',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeiWOMEJ0h1Pv4_uuJhsSsgODjCP4SzJp7E_GxfrNHhKewcUMSanlMMjGdY9T2fM8lNCt3kfNMuuBkui-74cogEGRfOKcmsNSDQDAoCCxfbw9h1ZbLZBNWEgG5IygY7WnPpUvdPuPn5otf1iafNAsDeIe0x119EWX8sE1-IU9QN1WW8CVQhNAZnolqfMzcHzRDTRlcEeGWIi_rfAvRP7X42j_Zn8_8JkmICmYDlv0ZhQi7lciSu_kz',
  streak: 4
};

export const mockGyms = [
  {
    id: '1',
    name: 'Iron House Fitness',
    verified: true,
    area: 'Mirpur 10',
    distance: 0.7,
    time: 8, // minutes walking
    rating: 4.8,
    reviews: 124,
    status: 'open',
    closesAt: '11 PM',
    crowd: 'low',
    tier: 'Active',
    amenities: ['Strength', 'Cardio', 'Locker'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv7QgNRjmoWn5WZodJ_VKAQaSCSJ0TWYHEP0E_pXrFCgV2z7Jd5hzs-JcosUQNwnoiP4vxjMkMKlPN1TtxAOSMiANsCHUS-tk-s8q6JRPCNmyEnW_prpWyBhraPIruUT3SeLosy3IdRyqOciFofNoyUfDNqPc3HKn7WdYfV9p9gkUXJF-JIfhcdO2-FCwDTwYUWRDNljhVv4M85e8gyJ04rqxl7ISLOBw2WrF_9XL7bGpXhisdgwZT'
  },
  {
    id: '2',
    name: 'PowerFit Mirpur',
    verified: true,
    area: 'Mirpur 12',
    distance: 0.9,
    time: 12,
    rating: 4.6,
    reviews: 89,
    status: 'open',
    closesAt: '11 PM',
    crowd: 'low',
    tier: 'Active',
    amenities: ['Strength', 'Functional', 'AC'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIpddF4yUHZkFFyDdyDNd619WlsAaGzjuHYo94Ng5eSAKfP1qimg9ipOQAcmDL0xOmr_VX8Jl2DMaBC7hh5CPRIx57naZ1yBTCQFKEujG0sExT8c_ZnDdDW8lV_5OgjL-wU59xXlhnTJe_gNsB6Ku0rnPRJhGhYJ_c9SexPx-0TlWN6yCXWxY1zaygmPyk9Xm98dmrRN8Tz22xp7efliHSRfUuqYBAq1ITCDjunkA1yP1I-jiZigDm'
  },
  {
    id: '3',
    name: 'Block 35 Fitness',
    verified: true,
    area: 'Gulshan 2',
    distance: 8.5,
    time: 45,
    rating: 4.9,
    reviews: 312,
    status: 'open',
    closesAt: '12 AM',
    crowd: 'moderate',
    tier: 'Unlimited',
    amenities: ['Cardio', 'Pool', 'Sauna'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWUnns9yEyi_0oKfvYG7Uf1FPB5CSm8_fOUfADE1h8jUV2AXTcEPmxVvrqX0I-1huoYfWwCcYeuCxRPEdUbfG5site_oOLbwXXqaJwZqWpLQw4aeWB2MKxTTY2TI04LjRTikp2vqL1DuPzTML9LuEnDPRLGu9vWktEn3DjQhRuWtEez_cDKU6iwIJqbTJJzW8tyA2t8dy2VRU5r5W7XqFtF1UQTnHPiCo87MZwtEoGTg1_UnbexyAd'
  },
  {
    id: '4',
    name: 'Urban Fit Studio',
    verified: true,
    area: 'Banani',
    distance: 6.2,
    time: 30,
    rating: 4.7,
    reviews: 204,
    status: 'open',
    closesAt: '10 PM',
    crowd: 'busy',
    tier: 'Active',
    amenities: ['Yoga', 'HIIT', 'Women Friendly'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9sSfMJY7KKbM-MHfEWhelNHV9kuy3WF8dFG6DlDVR7C0a0rah28rkLCVU0mmlZniVa4hTis88woP0n228QLl2VpqB6OCmsmab8SwVkPadz-TE7qNkRdV2MHsEzrC4_sEqFu5oJ5bsAAq7ClRY0PRmfT_sjlaIUAwxb5sswoMszOT8wtltrZEx9BUan5xOQcWXVjFZ_-p8mLhwR0fDqcfCRMYZcCNEaocHJJVJCJK03xHW8K9LQj7p'
  }
];

export const mockActivity = [
  { id: 1, type: 'checkin', gym: 'Iron House Fitness', date: 'Today — 7:12 PM' },
  { id: 2, type: 'workout', gym: 'PowerFit Mirpur', date: 'Tuesday — 8:04 PM' },
  { id: 3, type: 'achievement', title: '7-day activity goal achieved', date: 'Monday' }
];
