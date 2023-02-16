export interface ProjectStatus {
    name: string;
    value: string;
    description?: string;

    status?: 'active' | 'inactive' | 'completed';
}

export const projectStatuses : ProjectStatus[] = [
    // {
    //     name: 'Open For Creator Enrollment',
    //     value: 'open',
    //     description: 'This project is open for creator enrollment.',
    //     status: 'completed'
    // },
    // {
    //     name: 'Closed For Enrollment',
    //     value: 'closed',
    //     description: 'This project is closed for enrollment.'
    // },
    {
        name: 'Enrolled',
        value: 'enrolled',
        description: 'You have enrolled in this project.',
        status: 'completed'
    },
    {
        name: 'Brand Reviewing Request',
        value: 'brand_review_request',
        description: 'The brand is reviewing your enrollment request.',
        status: 'completed'
    },
    {
        name: 'Brand Approved Enrollment',
        value: 'brand_approved_enrollment',
        description: 'The brand has approved your enrollment request.',
        status: 'active'
    },
    // {
    //     name: 'Brand Rejected Enrollment',
    //     value: 'brand_rejected_enrollment',
    //     description: 'The brand has rejected your enrollment request.'
    // },
    {
        name: 'Brand Proposal Submitted',
        value: 'brand_proposal_submitted',
        description: 'The brand has submitted a proposal for this project.',
        status: 'inactive'
    },
    {
        name: 'Brand Proposal Accepted',
        value: 'brand_proposal_accepted',
        description: 'You have accepted the brand proposal.',
        status: 'inactive'
    },
    {
        name: 'Brand Proposal Rejected',
        value: 'brand_proposal_rejected',
        description: 'You have rejected the brand proposal.',
        status: 'inactive'
    },
    {
        name: 'Brand Contract Sent',
        value: 'brand_contract_sent',
        description: 'The brand has sent you a contract for this project.',
        status: 'inactive'
    },
    {
        name: 'Brand Contract Signed',
        value: 'brand_contract_signed',
        description: 'You have signed and uploaded the contract.',
        status: 'inactive'
    },
    {
        name: 'First Payment Received',
        value: 'first_payment_received',
        description: 'You have received the first payment for this project.',
        status: 'inactive'
    },
    {
        name: 'Project Started',
        value: 'project_started',
        description: 'You have started working on this project.',
        status: 'inactive'
    },
    {
        name: 'Project Delivered',
        value: 'project_delivered',
        description: 'You have delivered the project to the brand.',
        status: 'inactive'
    },
    {
        name: 'Project Approved',
        value: 'project_approved',
        description: 'The brand has approved the project.',
        status: 'inactive'
    },
    {
        name: 'Full Payment Received',
        value: 'full_payment_received',
        description: 'You have received the full payment for this project.',
        status: 'inactive'

    },
    {
        name: 'Project Completed',
        value: 'project_completed',
        description: 'You have completed this project.',
        status: 'inactive'
    }
];
