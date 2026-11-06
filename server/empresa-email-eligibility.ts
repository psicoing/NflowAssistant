/** Alias ec is deliberate: listing, selection and last-second checks share this rule. */
export const empresaEmailEligibilitySql = `(
  ec.opted_out IS FALSE
  AND ec.email IS NOT NULL
  AND trim(ec.email) ~ '^[^[:space:]@<>,;"]+@[^[:space:]@<>,;"]+[.][^[:space:]@<>,;"]+$'
  AND NOT EXISTS (
    SELECT 1 FROM empresa_suppression_list esl
    WHERE (esl.suppression_type = 'email' AND esl.normalized_value = lower(trim(ec.email)))
       OR (esl.suppression_type = 'domain' AND esl.normalized_value = lower(split_part(trim(ec.email), '@', 2)))
       OR (esl.suppression_type = 'company' AND esl.normalized_value =
         lower(regexp_replace(trim(COALESCE(ec.company, '')), '\\s+', ' ', 'g')))
  )
)`;
