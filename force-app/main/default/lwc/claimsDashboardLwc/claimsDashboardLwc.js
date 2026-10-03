import { LightningElement, wire, track } from 'lwc';
import getAssignedClaims from '@salesforce/apex/ClaimsAdjusterController.getAssignedClaims';

export default class ClaimsDashboardLwc extends LightningElement {
    @track allClaims = [];
    @track visibleClaims = [];
    error;

    @wire(getAssignedClaims)
    wiredClaims({ error, data }) {
        if (data) {
            this.allClaims = data;
            this.visibleClaims = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.allClaims = undefined;
            this.visibleClaims = undefined;

            console.error(
                'Error retrieving claims:',
                JSON.stringify(error)
            );
        }
    }

    handleFilterChange(event) {
        const selectedPolicyType = event.target.value;

        if (selectedPolicyType === 'All') {
            this.visibleClaims = this.allClaims;
        } else {
            this.visibleClaims = this.allClaims.filter(
                claim => claim.policyType === selectedPolicyType
            );
        }
    }

    get policyTypeOptions() {
        return [
            {
                label: 'All Policy Types',
                value: 'All'
            },
            {
                label: 'Auto',
                value: 'Auto'
            },
            {
                label: 'Property',
                value: 'Property'
            },
            {
                label: 'Life',
                value: 'Life'
            }
        ];
    }
}
