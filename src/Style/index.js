// Lab Management System Types (JavaScript version)

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'lab_manager' | 'lab_member' | 'staff' | 'security_guard'} role
 * @property {string} [department]
 * @property {string} [avatar]
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string[]} labManagerIds
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Lab
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} location
 * @property {number} capacity
 * @property {string[]} equipment
 * @property {string} departmentId
 * @property {boolean} isAvailable
 * @property {{ start: string, end: string }} operatingHours
 * @property {string} createdAt
 */

/**
 * @typedef {Object} BookingRequest
 * @property {string} id
 * @property {string} labId
 * @property {string} requesterId
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} purpose
 * @property {'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'} status
 * @property {string} [approvedBy]
 * @property {string} [rejectedReason]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} LabAccessRequest
 * @property {string} id
 * @property {string} labId
 * @property {string} requesterId
 * @property {'urgent_open' | 'urgent_close'} requestType
 * @property {string} reason
 * @property {'pending' | 'in_progress' | 'completed' | 'rejected'} status
 * @property {string} [securityGuardId]
 * @property {string} [resolvedAt]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} LabEvent
 * @property {string} id
 * @property {string} labId
 * @property {'lab_opened' | 'lab_closed' | 'incident' | 'maintenance' | 'booking_started' | 'booking_ended'} eventType
 * @property {string} description
 * @property {string} reportedBy
 * @property {string[]} [images]
 * @property {string} timestamp
 * @property {Object<string, any>} [metadata]
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} recipientId
 * @property {string} title
 * @property {string} message
 * @property {'booking_request' | 'booking_approved' | 'booking_rejected' | 'lab_access_request' | 'lab_event' | 'system'} type
 * @property {boolean} isRead
 * @property {string} [relatedEntityId]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ZaloNotificationConfig
 * @property {string} [webhookUrl]
 * @property {string} [accessToken]
 * @property {boolean} isEnabled
 * @property {string[]} recipientPhones
 */

/**
 * @typedef {Object} LabStatistics
 * @property {number} totalBookings
 * @property {number} pendingBookings
 * @property {number} approvedBookings
 * @property {number} completedBookings
 * @property {number} utilizationRate
 * @property {number} avgBookingDuration
 */

/**
 * @typedef {Object} DashboardData
 * @property {Lab[]} labs
 * @property {BookingRequest[]} recentBookings
 * @property {BookingRequest[]} pendingRequests
 * @property {LabEvent[]} recentEvents
 * @property {LabStatistics} statistics
 */
