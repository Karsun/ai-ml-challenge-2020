
export const mockedDataForPredictions = () => {
    const d = [
        {
            sectionName: '1. Definitions',
            totalClauses: 6,
            acceptable: 6,
            unacceptable: 0,
            clauses: [
                { text: 'a. “Client Data” refers to the data Client or any User uploads or otherwise supplies to, or stores in, the Services under Client’s account.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'b. “Documentation” means the user guides, help information, and other technical and operations manuals and specifications for the Services made available by COMPANY in electronic or other form, as updated from time to time.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'c. “Order Form” refers to the document which specifies, among other things, the Services to be provided to Client by COMPANY as well as the scope of use, order effective date and term, Subscription Fees and other prices, billing period, and other applicable details. The initial Order Form entered into by the parties is attached to this Agreement. To be effective, additional Order Forms must be signed by both parties. All Order Forms are subject to this Agreement.', prediction: 0, acc_prob: 94.37, unacc_prob: 5.63 },
                { text: 'd. “Services” refers to the online integrated asset management and decision support system offerings, and any other product or service provided to Client by COMPANY as specified on the applicable Order Form.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'e. “Subscription Fees” mean the fees paid by Client in accordance with the AGENCY Pricelist for the right to access and use the Services during the applicable Service Term.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'f. “User" refers to each employee, agent, contractor, and consultant who is authorized by Client to use the Services, and has been supplied a user identification and password by Client (or by COMPANY at Client’s request).', prediction: 0, acc_prob: 99.9, unacc_prob: 0 }
            ]
        },
        {
            sectionName: '2. Provision of the Services',
            totalClauses: 8,
            acceptable: 7,
            unacceptable: 1,
            clauses: [
                { text: 'a. Availability and Use of the Services. COMPANY will make the Services available to Client in accordance with each Order Form entered into by the parties. Client’s use of the Services is limited to its internal business purposes solely for the scope and use limitations specified in the applicable Order Form.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'b. Changes to the Services. COMPANY may make changes, modifications and enhancements to the Services from time to time. Any material change, modification, or enhancement of the service agreed to in the Order Form and this Agreement shall be presented to Client for review and will not be effective unless and until both parties sign a written agreement updating these terms.', prediction: 1, acc_prob: 20.95, unacc_prob: 79.05 },
                { text: 'c. Support for the Services. COMPANY will provide Client with the support described in COMPANY’ then current technical support policy, a current copy of which is attached as Exhibit A.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'd. Business Continuity and Security Measures for the Services.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'i. Data Backup. The Services include standard off-site backup and recovery capabilities including daily incremental backups with synthetic full backups created weekly and monthly. Weekly and monthly full backups are stored off-site on disk or via a cloud data storage service. With respect to long term retention, COMPANY follows industry standard best practices in having 24 monthly and seven yearly backups. Upon request, COMPANY will offer additional long term monthly and yearly data retention options tailored to address unique Client requirements.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'ii. Data Restoration. In the event of a loss of Client Data due to a disaster, the Data is restored using the most recent backup so that the Services are available within twelve hours of the incident. In the event of a server (host) loss, an already “imaged” stand-by server will be provisioned in place of the failed server in the “state-less” application server farm. This standby server can be in production within four hours.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'iii. Business Continuity. COMPANY’ business continuity plans adhere to industry best practices. COMPANY will invoke those plans in the event there is a clearly adverse impact to the Services. COMPANY will review its business continuity plan for disaster recovery on an annual basis at Client’s request including any changes that have been made to the plan since the prior review. COMPANY will also ensure that any changes to its business continuity plans are communicated to Client in the event of any material change to the plan.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 },
                { text: 'iv. Security Measures. In providing the Services, COMPANY complies with its information security procedures. A current copy of these procedures is attached as Exhibit B. COMPANY will provide Client on an annual basis with SSAE16 Reviews from the third-party data center providers utilized in the provision of the Services to Client. Client acknowledges and agrees that all SSAE16 Reviews constitute Confidential Information of COMPANY. COMPANY recognizes that Federal agencies are subject to the Freedom of Information Act, 5 U.S.C. 552, which requires that certain information be released, despite being characterized as “confidential” by the vendor.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 }
            ]
        },
        {
            sectionName: '3. Order Process',
            totalClauses: 1,
            acceptable: 1,
            unacceptable: 0,
            clauses: [
                { text: 'Client will order Services by signing an Order Form. In the event that Client’s business practices require a purchase order number be issued prior to payment of any COMPANY invoices issued pursuant to an Order Form, Client will promptly provide that number to COMPANY. Except as set forth in the Order Form, terms, provisions or conditions on any purchase order, acknowledgement, or other business form or writing that Client may provide to COMPANY or use in connection with the procurement of Services (or any software) from COMPANY will have no effect on the rights, duties or obligations of the parties under this Agreement, regardless of any failure of COMPANY to object to such terms, provisions or conditions.', prediction: 0, acc_prob: 99.84, unacc_prob: 0.26 }
            ]
        },
        {
            sectionName: '4. Professional Services',
            totalClauses: 1,
            acceptable: 1,
            unacceptable: 0,
            clauses: [
                { text: 'If professional services (such as implementation, training, consulting, etc.) are included in any Order Form (“Professional Services”), then they will be set forth in a separately executed Statement of Work (“Statement of Work”) containing relevant project details including, if applicable, any works to be developed by COMPANY and provided to Client (“Deliverables”). In addition, the following provisions will apply to all Statements of Work: (a) COMPANY will retain all ownership rights to any and all Deliverables excluding, any pre-existing technology, materials or Client Confidential Information supplied by Client for incorporation into such Deliverable; and (b) COMPANY grants Client a royalty-free, non-exclusive, non-transferable, non-assignable worldwide license to use any Deliverable to the extent necessary to permit Client to use the Deliverable in connection with the Services during the Service Term. All Professional Services are provided only as an adjunct to the Services, and are separate and apart from the Services.', prediction: 0, acc_prob: 99.9, unacc_prob: 0 }
            ]
        },
        {
            sectionName: '5. Client Responsibilities Relating to Use of the Services',
            totalClauses: 2,
            acceptable: 1,
            unacceptable: 1,
            clauses: [
                { text: 'a. Access to the Services. Client is responsible for (i) all activities conducted under its User accounts, (ii) complying with all applicable laws and regulations in connection with Client’s use of the Services, and (iii) obtaining and maintaining any hardware, software and network infrastructure (“Client Equipment”) and any ancillary services needed to connect to, access or otherwise use the Services, and ensuring that the Client Equipment and ancillary services comply with the configuration requirements specified by COMPANY and agreed upon with Client. Client agrees to notify COMPANY immediately of any unauthorized use of any password or account or any other known or suspected breach of security with respect to the Services.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
                { text: 'b. Use of the Services. Client agrees to use the Services solely for its internal business purposes in accordance with applicable laws. Client will not: (i) resell, sublicense, or lease the Services or make the Services available to third parties for or through any time-share arrangement, (ii) make the Services available to any third party except as required by Users, (iii) send or store infringing or unlawful material, (iv) attempt to gain unauthorized access to the Services or its related systems or networks, (v) interfere with or disrupt the integrity or performance of the Services or the data contained therein, (vi) modify, copy or create derivative works based on the Services, (vii) reverse engineer the Services, or (viii) access the Services for the purpose of building a competitive product or service or copying its features or user interface.', prediction: 1, acc_prob: 0.46, unacc_prob: 99.54 }
            ]
        },
        {
            sectionName: '6. Fees and Payment Terms',
            totalClauses: 4,
            acceptable: 3,
            unacceptable: 1,
            clauses: [
                { text: 'a. Fees. Client agrees to pay all Subscription Fees and other charges as specified in accordance with the AGENCY Pricelist on each executed Order Form and Statement of Work.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
                { text: 'b. Additional Payment Obligations. All payments will be made in U.S. dollars. Fees are due within 30 days from receipt of COMPANY’ invoice (or as otherwise set forth in the invoice) unless subject to a reasonable and good faith dispute.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
                { text: 'c. Taxes. Notwithstanding the provisions of FAR 52.229-3, Federal, State and Local Taxes, January 1991, the AGENCY Pricelist excludes all State and Local taxes levied on or measured by this Agreement or sales price of the Services furnished under this Agreement. Taxes excluded from the Agreement price pursuant to the preceding sentence shall be separately stated on COMPANY’ invoices and Client agrees either to pay to COMPANY amounts covering such taxes or to provide evidence (i.e., tax exemption certificate) necessary to sustain an exemption therefrom.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
                { text: 'd. Scope of Use of the Services. Client is responsible for monitoring its use of the Services. If Client\'s use of the Services is found to be greater than that for which Client contracted, COMPANY will invoice Client for additional fees for the period of such additional use, and Client will pay fees owed in accordance with this Agreement.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
            ]
        },
        {
            sectionName: '7. Indemnification',
            totalClauses: 4,
            acceptable: 3,
            unacceptable: 1,
            clauses: [
                { text: 'i. Indemnification Obligation. COMPANY will defend Client from and against all claims, suits or actions arising out of or resulting from any action against Client that is based on any third party claim that use of the Services as authorized in this Agreement infringes that party’s United States patents, copyrights, or trade secrets, and will pay the amount of any final judgment awarded (including reasonable attorney’s fees and costs) or final settlement made with respect to such claim provided that COMPANY is notified promptly by the Client in writing of any such action. COMPANY shall coordinate its defense with the Department of Justice as requested by Client. In addition to COMPANY’ obligation of indemnification, if the Services become or, in COMPANY’ opinion, are likely to become the subject of a claim of infringement, COMPANY may, at its option, either procure for Client the right to continue using the Services or replace or modify the Services to make the Services non-infringing. If COMPANY, in its sole discretion, concludes that neither of these alternatives is reasonably available, COMPANY may terminate Client’s right to use the Services and release Client from its obligation to make future payments for the Services or issue a pro rata refund for any fees paid in advance. The foregoing states the entire obligation and liability of COMPANY with respect to any infringement claim. Nothing contained herein shall be construed in derogation of the U.S. Department of Justice’s right to defend any claim or suit brought against the U.S. pursuant to its jurisdictional statute 28 U.S.C. § 516.', prediction: 1, acc_prob: 0.37, unacc_prob: 99.63 },
                { text: 'ii. Exceptions. COMPANY’ indemnification obligations will not apply to any claim resulting from the (i) use of the Services in combination with other products, services or devices if the claim would not have arisen but for such combination or in a manner not authorized by this Agreement (or provided for in the Documentation), or (ii) use of the Services other than in accordance with this Agreement.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
                { text: 'iii. Obligation. The provisions of this Section 10 set forth COMPANY’ sole and exclusive obligations, and Client’s sole and exclusive remedies, with respect to any third party claim.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 },
                { text: 'b. No Indemnification by Client. Client will not have any indemnification or defense obligations to COMPANY or any third party in connection with the Services.', prediction: 0, acc_prob: 99.99, unacc_prob: 0 }
            ]
        }
    ];

    return d;
}