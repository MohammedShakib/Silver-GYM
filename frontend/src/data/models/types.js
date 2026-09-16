/**
 * @file types.js
 * Canonical domain models for Silver GYM
 * Used for documentation, autocomplete, and validating mock/API responses.
 */

/**
 * @typedef {Object} Location
 * @property {string} area
 * @property {string} address
 * @property {number} [latitude]
 * @property {number} [longitude]
 */

/**
 * @typedef {Object} GymStatus
 * @property {'open'|'closing_soon'|'closed'} status
 * @property {string} [opensAt]
 * @property {string} [closesAt]
 * @property {'low'|'moderate'|'busy'|'full'} crowdLevel
 * @property {number} crowdPct
 */

/**
 * @typedef {Object} GymStats
 * @property {number} rating
 * @property {number} reviewCount
 */

/**
 * @typedef {Object} Gym
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} image
 * @property {string[]} images
 * @property {string} description
 * @property {boolean} verified
 * @property {Location} location
 * @property {GymStats} stats
 * @property {GymStatus} status
 * @property {string[]} amenities
 * @property {string[]} plans - Plans that include this gym
 * @property {Array<{day: string, time: string}>} hours
 * @property {number[]} crowdByHour
 */

/**
 * @typedef {Object} Plan
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} visitLimit
 * @property {string} gymTier
 * @property {string[]} features
 * @property {string[]} missing
 */

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} firstName
 * @property {string} email
 * @property {string} phone
 * @property {string} avatar
 * @property {Object} preferences
 * @property {string} memberSince
 */

/**
 * @typedef {Object} Membership
 * @property {string} id
 * @property {string} memberId
 * @property {string} planId
 * @property {'active'|'paused'|'expired'} status
 * @property {number} monthlyVisitLimit
 * @property {number} visitsUsed
 * @property {number} visitsRemaining
 * @property {string} renewalDate
 * @property {number} streak
 */

/**
 * @typedef {Object} CheckIn
 * @property {string} id
 * @property {string} memberId
 * @property {string} gymId
 * @property {string} checkedInAt
 * @property {'verified'|'pending'|'rejected'} status
 * @property {'member_qr'|'gym_qr'|'demo'} method
 */

/**
 * @typedef {Object} ActivityEntry
 * @property {string} id
 * @property {'checkin'|'achievement'} type
 * @property {string} [gymId]
 * @property {string} [gymName]
 * @property {string} [title]
 * @property {string} date
 * @property {string} time
 * @property {string} [duration]
 */

export default {};
