// Answer choices for the readiness check. Labels only: nothing here is gated.
export const OPTS: Record<string, string[][]> = {
  calltime: [['morning', 'Morning'], ['midday', 'Middle of the day'], ['afternoon', 'Afternoon'], ['evening', 'Evening'], ['any', 'Any time']],
  country: [['au', 'Australia'], ['sg', 'Singapore'], ['os', 'Elsewhere overseas']],
  existing: [['no', 'No, I am new to Atlantis'], ['yes', 'Yes, I would like to invest more']],
  entity: [['ind', 'Just me'], ['joint', 'Jointly with my partner'], ['co', 'Through a company'], ['trust', 'Through a family trust'], ['smsf', 'Through my SMSF'], ['unk', 'Not sure yet']],
  experience: [['many', 'Yes, several times'], ['some', 'Once or twice'], ['none', 'No, this would be my first']],
  heard: [['referral', 'A broker, accountant or adviser'], ['friend', 'A friend or family member'], ['linkedin', 'LinkedIn'], ['google', 'Google search'], ['event', 'An event or seminar'], ['other', 'Somewhere else']],
  source: [['cash', 'Cash or savings', 'Ready now'], ['td', 'Term deposit or shares', 'Needs to mature or be sold'], ['equity', 'Equity in a property', 'Needs a refinance'], ['super', 'Super or an SMSF', 'May need setting up or advice'], ['unk', 'Not sure yet', 'We will help you work it out']],
  broker: [['yes', 'Yes'], ['no', 'No, I would like an introduction'], ['unsure', 'Not sure']],
  smsf: [['yes', 'Yes, already set up'], ['no', 'No'], ['unsure', 'Not sure']],
  motive: [['income', 'Regular income for retirement or lifestyle'], ['yield', 'A better return than the bank'], ['diversify', 'Spreading money beyond property or shares'], ['browse', 'Just exploring for now'], ['unk', 'Not sure']],
  decider: [['sole', 'Just me'], ['jointin', 'Me and my partner, we have discussed it'], ['jointout', 'Me and my partner, not discussed yet'], ['adviser', 'My accountant or adviser will help decide'], ['unk', 'Not sure']],
  when: [['30', 'Within 30 days'], ['90', '1 to 3 months'], ['180', '3 to 6 months'], ['later', 'Later than that'], ['unk', 'Not sure']],
  event: [['dated', 'Yes, I know the date'], ['undated', 'Yes, no date yet'], ['none', 'No'], ['unk', 'Not sure']],
  wholesale: [['cert', 'Yes, I have a current certificate'], ['likely', 'No, but I may qualify', 'Net assets of $2.5m or more, or income of $250k or more in each of the last two years'], ['no', 'I do not think I qualify'], ['unk', 'Not sure']],
  wholesaleSG: [['cert', 'Yes, I am an accredited investor'], ['likely', 'No, but I may qualify', 'Net personal assets over S$2m, financial assets over S$1m, or income of S$300k or more in the last 12 months'], ['no', 'I do not think I qualify'], ['unk', 'Not sure']],
  risk: [['ok', 'Comfortable with a 1 to 3 year term'], ['liquid', 'I may need access at short notice'], ['guarantee', 'I need my capital guaranteed'], ['unk', 'Not sure']],
  concerns: [['more_info', 'I would like more information'], ['explain', 'I would like it explained again'], ['understand', 'I do not fully understand how it works'], ['convinced', 'I am not convinced yet'], ['risk', 'I am worried about the risk'], ['lockup', 'I do not want my money locked away'], ['partner', 'I need to talk to my partner or accountant'], ['compare', 'I want to compare it with other options'], ['timing', 'The timing is not right yet'], ['ready', 'I am happy to go ahead']]
};
