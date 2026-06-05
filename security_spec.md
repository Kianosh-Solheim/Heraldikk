# Phase 0: Payload-First Security TDD

## Data Invariants
1. A task/article/event/arm cannot exist without being well-formed.
2. Only users in the `admins` collection can create/update/delete events and articles.
3. Any authenticated user (email verified) can create an arm but it MUST default to 'pending' status.
4. Only users in the `admins` collection can update an arm status to 'approved'.
5. Only the owner can update their own pending arm.
6. Public (visitors) can read articles, events, and approved arms.
7. Only members (authenticated users) can create arms, read their own pending arms, and read approved arms.
8. Admins can read all arms.

## The Dirty Dozen
1. Create Event as non-admin.
2. Update Event as non-admin.
3. Create Article as non-admin.
4. Create Arm with approved status as non-admin.
5. Change Arm status to approved as non-admin owner.
6. Update someone else's Arm.
7. Read someone else's pending Arm.
8. Create Arm with 2000 char status string.
9. Spoof 'ownerId' when creating an Arm.
10. Update Arm and change `ownerId`.
11. Update Arm skipping name validation.
12. Attempt to create User profile spoofing email.
