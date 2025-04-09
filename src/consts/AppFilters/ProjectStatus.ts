export interface ProjectStatus {
    name: string;
    value: string;
    description?: string;

    status?: 'active' | 'inactive' | 'completed' | 'rejected'
    brandName?: string;
    brandDescription?: string;
}

export const projectStatuses : ProjectStatus[] = [
    {
        name: 'Enrolled',
        value: 'enrolled',
        description: 'You have enrolled in this project.',
        status: 'completed',
        brandName: 'Creator Enrolled',
        brandDescription: 'The creator has enrolled in this project.',
    },
    {
        name: 'Brand Reviewing Request',
        value: 'brand_review_request',
        description: 'The brand is reviewing your enrollment request.',
        status: 'inactive',
        brandName: 'Pending Your Approval',
        brandDescription: 'The creator has enrolled in this project. Please review their enrollment request.',
    },
    {
        name: 'Brand Approved Enrollment',
        value: 'brand_approved_enrollment',
        description: 'The brand has approved your enrollment request. Please wait for theme to send a contract.',
        status: 'inactive',
        brandName: 'Submit a Contract',
        brandDescription: 'Please submit a contract for the creator to review.',
    },
    {
        name: 'Brand Contract Received',
        value: 'brand_contract_received',
        description: 'Please review, sign and send the signed contract to the brand.',
        status: 'inactive',
        brandName: 'Pending signed contract',
        brandDescription: 'Please wait for the creator to review and sign the contract.',
    },
    {
        name: 'Brand Contract Signed',
        value: 'brand_contract_signed',
        description: 'You have signed and uploaded the contract.',
        status: 'inactive',
        brandName: 'Signed Contract Received',
        brandDescription: 'The creator has sent you a signed contract. Please review and make the first payment for this project.'
    },
    {
        name: 'First Payment Received',
        value: 'first_payment_received',
        description: 'You have received the first payment for this project.',
        status: 'inactive',
        brandName: 'First Payment Sent',
        brandDescription: 'The creator has received the payment and will start working on the project',
    },
    {
        name: 'Project Started',
        value: 'project_started',
        description: 'Work has started on this project.Please upload the deliverables to your socials or with WeTransfer once its ready.',
        status: 'inactive',
        brandName: 'Project Started',
        brandDescription: 'The creator has started working on this project.',
    },
    {
        name: 'Project Delivered',
        value: 'project_delivered',
        description: 'Please wait for the brand to approve the project.',
        status: 'inactive',
        brandName: 'Project Delivered',
        brandDescription: 'The creator has delivered the project to you. Please review and approve the project.',
    },
    {
        name: 'Project Approved',
        value: 'project_approved',
        description: 'The brand has approved the project and will send you the second payment.',
        status: 'inactive',
        brandName: 'You approved the project. Please make the second payment.',
        brandDescription: 'The creator has delivered the project to you. Please review and approve the project.',
    },
    {
        name: 'Full Payment Received',
        value: 'full_payment_received',
        description: 'You have received the full payment for this project.',
        status: 'inactive',
        brandName: 'Full Payment Received',
        brandDescription: 'The creator has received the full payment for this project.',

    },
    {
        name: 'Project Completed',
        value: 'project_completed',
        description: 'You have completed this project.',
        status: 'inactive',
        brandName: 'Project Completed',
        brandDescription: 'The project has been completed.',
    }
];
