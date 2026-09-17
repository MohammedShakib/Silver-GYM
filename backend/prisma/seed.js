import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GYM_IMAGES = {
  ironHouse:  'https://lh3.googleusercontent.com/aida-public/AB6AXuAv7QgNRjmoWn5WZodJ_VKAQaSCSJ0TWYHEP0E_pXrFCgV2z7Jd5hzs-JcosUQNwnoiP4vxjMkMKlPN1TtxAOSMiANsCHUS-tk-s8q6JRPCNmyEnW_prpWyBhraPIruUT3SeLosy3IdRyqOciFofNoyUfDNqPc3HKn7WdYfV9p9gkUXJF-JIfhcdO2-FCwDTwYUWRDNljhVv4M85e8gyJ04rqxl7ISLOBw2WrF_9XL7bGpXhisdgwZT',
  block35:    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIpddF4yUHZkFFyDdyDNd619WlsAaGzjuHYo94Ng5eSAKfP1qimg9ipOQAcmDL0xOmr_VX8Jl2DMaBC7hh5CPRIx57naZ1yBTCQFKEujG0sExT8c_ZnDdDW8lV_5OgjL-wU59xXlhnTJe_gNsB6Ku0rnPRJhGhYJ_c9SexPx-0TlWN6yCXWxY1zaygmPyk9Xm98dmrRN8Tz22xp7efliHSRfUuqYBAq1ITCDjunkA1yP1I-jiZigDm',
  urbanFit:   'https://lh3.googleusercontent.com/aida-public/AB6AXuDWUnns9yEyi_0oKfvYG7Uf1FPB5CSm8_fOUfADE1h8jUV2AXTcEPmxVvrqX0I-1huoYfWwCcYeuCxRPEdUbfG5site_oOLbwXXqaJwZqWpLQw4aeWB2MKxTTY2TI04LjRTikp2vqL1DuPzTML9LuEnDPRLGu9vWktEn3DjQhRuWtEez_cDKU6iwIJqbTJJzW8tyA2t8dy2VRU5r5W7XqFtF1UQTnHPiCo87MZwtEoGTg1_UnbexyAd',
  powerFit:   'https://lh3.googleusercontent.com/aida-public/AB6AXuD9sSfMJY7KKbM-MHfEWhelNHV9kuy3WF8dFG6DlDVR7C0a0rah28rkLCVU0mmlZniVa4hTis88woP0n228QLl2VpqB6OCmsmab8SwVkPadz-TE7qNkRdV2MHsEzrC4_sEqFu5oJ5bsAAq7ClRY0PRmfT_sjlaIUAwxb5sswoMszOT8wtltrZEx9BUan5xOQcWXVjFZ_-p8mLhwR0fDqcfCRMYZcCNEaocHJJVJCJK03xHW8K9LQj7p',
  cardio:     'https://lh3.googleusercontent.com/aida-public/AB6AXuDWUnns9yEyi_0oKfvYG7Uf1FPB5CSm8_fOUfADE1h8jUV2AXTcEPmxVvrqX0I-1huoYfWwCcYeuCxRPEdUbfG5site_oOLbwXXqaJwZqWpLQw4aeWB2MKxTTY2TI04LjRTikp2vqL1DuPzTML9LuEnDPRLGu9vWktEn3DjQhRuWtEez_cDKU6iwIJqbTJJzW8tyA2t8dy2VRU5r5W7XqFtF1UQTnHPiCo87MZwtEoGTg1_UnbexyAd',
  avatar:     'https://lh3.googleusercontent.com/aida-public/AB6AXuAeiWOMEJ0h1Pv4_uuJhsSsgODjCP4SzJp7E_GxfrNHhKewcUMSanlMMjGdY9T2fM8lNCt3kfNMuuBkui-74cogEGRfOKcmsNSDQDAoCCxfbw9h1ZbLZBNWEgG5IygY7WnPpUvdPuPn5otf1iafNAsDeIe0x119EWX8sE1-IU9QN1WW8CVQhNAZnolqfMzcHzRDTRlcEeGWIi_rfAvRP7X42j_Zn8_8JkmICmYDlv0ZhQi7lciSu_kz',
};

async function main() {
  console.log('Starting seed...');

  // Clean DB
  await prisma.checkIn.deleteMany();
  await prisma.savedGym.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.gymOpeningHour.deleteMany();
  await prisma.gymAmenity.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.gymImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.memberPreference.deleteMany();
  await prisma.savedLocation.deleteMany();
  await prisma.member.deleteMany();

  // Create Plans
  const planEssential = await prisma.membershipPlan.create({
    data: {
      id: 'essential',
      slug: 'essential',
      name: 'Essential',
      priceMonthly: 1990,
      visitLimit: 8,
      accessTier: 'STANDARD',
      active: true,
      displayOrder: 1
    }
  });

  const planActive = await prisma.membershipPlan.create({
    data: {
      id: 'active',
      slug: 'active',
      name: 'Active',
      priceMonthly: 3490,
      visitLimit: 15,
      accessTier: 'ACTIVE',
      active: true,
      displayOrder: 2
    }
  });

  const planUnlimited = await prisma.membershipPlan.create({
    data: {
      id: 'unlimited',
      slug: 'unlimited',
      name: 'Unlimited',
      priceMonthly: 5990,
      visitLimit: null,
      accessTier: 'PREMIUM',
      active: true,
      displayOrder: 3
    }
  });

  // Create Demo Member
  const member = await prisma.member.create({
    data: {
      id: 'SG-2048-DA',
      memberCode: 'SG-2048-DA',
      name: 'Alex Rahman',
      email: 'alex@example.com',
      phone: '+8801700000000',
      avatarUrl: GYM_IMAGES.avatar,
      status: 'ACTIVE',
      role: 'MEMBER'
    }
  });

  await prisma.memberPreference.create({
    data: {
      memberId: member.id,
      fitnessGoal: 'Strength',
      preferredWorkoutTime: 'Evening'
    }
  });

  // Create active membership
  const membership = await prisma.membership.create({
    data: {
      memberId: member.id,
      planId: planActive.id,
      status: 'ACTIVE',
      startsAt: new Date('2026-03-01T00:00:00Z'),
      renewsAt: new Date('2026-08-30T00:00:00Z'), // renewalDate: '30 August 2026'
      endsAt: null,
      visitsUsed: 12,
      cycleStartsAt: new Date('2026-07-30T00:00:00Z'),
      cycleEndsAt: new Date('2026-08-30T00:00:00Z'),
      autoRenew: true
    }
  });

  // Create Amenities
  const amenityData = [
    { slug: 'strength', name: 'Strength', iconKey: 'strength' },
    { slug: 'cardio', name: 'Cardio', iconKey: 'cardio' },
    { slug: 'ac', name: 'AC', iconKey: 'ac' },
    { slug: 'locker', name: 'Locker', iconKey: 'locker' },
    { slug: 'shower', name: 'Shower', iconKey: 'shower' },
    { slug: 'trainer', name: 'Trainer', iconKey: 'trainer' },
    { slug: 'wifi', name: 'WiFi', iconKey: 'wifi' },
    { slug: 'pool', name: 'Pool', iconKey: 'pool' },
    { slug: 'sauna', name: 'Sauna', iconKey: 'sauna' }
  ];

  for (const a of amenityData) {
    await prisma.amenity.create({ data: a });
  }

  const allAmenities = await prisma.amenity.findMany();

  const getAmenityId = (name) => {
    const am = allAmenities.find(a => a.name.toLowerCase() === name.toLowerCase());
    return am ? am.id : null;
  };

  // Create Gyms
  const gymIronHouse = await prisma.gym.create({
    data: {
      id: '1',
      slug: 'iron-house-fitness',
      name: 'Iron House Fitness',
      description: 'A premium strength and conditioning facility in the heart of Mirpur 10.',
      verified: true,
      accessTier: 'STANDARD',
      address: 'Level 4, Rahman Plaza, Mirpur 10 Circle, Dhaka 1216',
      area: 'Mirpur 10',
      latitude: 23.8052,
      longitude: 90.3696,
      logoUrl: GYM_IMAGES.ironHouse
    }
  });

  const amenitiesToAdd = ['Strength', 'Cardio', 'AC', 'Locker', 'Shower', 'Trainer', 'WiFi'];
  for (const name of amenitiesToAdd) {
    const id = getAmenityId(name);
    if (id) {
      await prisma.gymAmenity.create({
        data: { gymId: gymIronHouse.id, amenityId: id }
      });
    }
  }

  const gymPowerFit = await prisma.gym.create({
    data: {
      id: '2',
      slug: 'powerfit-mirpur',
      name: 'PowerFit Mirpur',
      description: 'Functional and strength training facility.',
      verified: true,
      accessTier: 'ACTIVE',
      address: 'Shop 12, Mirpur 12 Main Road, Dhaka 1216',
      area: 'Mirpur 12',
      latitude: 23.8211,
      longitude: 90.3665,
      logoUrl: GYM_IMAGES.powerFit
    }
  });

  const amenitiesPower = ['Strength', 'AC', 'Locker', 'Trainer'];
  for (const name of amenitiesPower) {
    const id = getAmenityId(name);
    if (id) {
      await prisma.gymAmenity.create({
        data: { gymId: gymPowerFit.id, amenityId: id }
      });
    }
  }

  const gymBlock35 = await prisma.gym.create({
    data: {
      id: '3',
      slug: 'block-35-fitness',
      name: 'Block 35 Fitness',
      description: 'Premium full-service gym in Gulshan.',
      verified: true,
      accessTier: 'PREMIUM',
      address: 'Block 35, Gulshan Avenue, Dhaka 1212',
      area: 'Gulshan 2',
      latitude: 23.7915,
      longitude: 90.4132,
      logoUrl: GYM_IMAGES.block35
    }
  });

  const amenitiesBlock = ['Strength', 'Cardio', 'AC', 'Locker', 'Shower', 'Pool', 'Sauna'];
  for (const name of amenitiesBlock) {
    const id = getAmenityId(name);
    if (id) {
      await prisma.gymAmenity.create({
        data: { gymId: gymBlock35.id, amenityId: id }
      });
    }
  }

  // Create CheckIns for Activity
  const now = new Date();
  await prisma.checkIn.create({
    data: {
      memberId: member.id,
      gymId: gymIronHouse.id,
      membershipId: membership.id,
      method: 'DEMO',
      status: 'VERIFIED',
      checkedInAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    }
  });
  
  await prisma.checkIn.create({
    data: {
      memberId: member.id,
      gymId: gymPowerFit.id,
      membershipId: membership.id,
      method: 'DEMO',
      status: 'VERIFIED',
      checkedInAt: new Date(now.getTime() - 48 * 60 * 60 * 1000) // 2 days ago
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
