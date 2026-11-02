// The alias c always refers to a stripe_commercial_contacts row.
export const stripeSuppressionCondition = `(
  EXISTS (SELECT 1 FROM empresa_suppression_list s
    WHERE (s.suppression_type='email' AND lower(trim(s.normalized_value))=c.email)
      OR (s.suppression_type='domain' AND lower(trim(s.normalized_value))=split_part(c.email,'@',2)))
  OR EXISTS (SELECT 1 FROM users u WHERE lower(trim(u.email))=c.email AND u.marketing_opted_out IS TRUE)
  OR EXISTS (SELECT 1 FROM email_leads l WHERE lower(trim(l.email))=c.email AND (l.consent_marketing IS FALSE OR l.unsubscribed_at IS NOT NULL))
  OR EXISTS (SELECT 1 FROM empresa_contacts e WHERE lower(trim(e.email))=c.email AND e.opted_out IS TRUE)
  OR EXISTS (SELECT 1 FROM institution_contacts i WHERE lower(trim(i.email))=c.email AND i.opted_out IS TRUE)
  OR EXISTS (SELECT 1 FROM mutua_contacts m WHERE lower(trim(m.email))=c.email AND m.opted_out IS TRUE)
  OR EXISTS (SELECT 1 FROM campaign_email_events e WHERE lower(trim(e.contact_email))=c.email
    AND e.kind IN ('unsubscribed','complained','bounced','blocked'))
)`;
export const stripeAuthorizationCondition = `COALESCE((
  SELECT a.action='grant' FROM stripe_commercial_authorizations a
  WHERE a.contact_id=c.id AND a.email=c.email ORDER BY a.id DESC LIMIT 1
), false)`;

export const stripeEligibilitySelect = `SELECT c.id,c.email,
  ${stripeSuppressionCondition} AS suppressed,
  ${stripeAuthorizationCondition} AS authorized FROM stripe_commercial_contacts c`;
