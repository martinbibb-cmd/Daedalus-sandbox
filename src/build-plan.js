export const canonicalBuildPlanPageUrl =
  "https://github.com/martinbibb-cmd/Daedalus-contracts/blob/main/DAEDALUS_BUILD_PLAN.md";

export const publishedBuildPlanCommit = "4402050";

export const publishedBuildPlanProjection = `# Daedalus Build Plan

Status: Sandbox read-only projection

Authority: Daedalus-contracts/DAEDALUS_BUILD_PLAN.md

Last aligned canonical commit: \`4402050\` on 2026-08-05

## Governing order

- Reality evidence
- Deterministic Working System and Run demonstration
- Behaviour and Run contract extraction from proven runtime needs
- Grounded explanation of demonstrated inputs, traces, transitions, and outputs

Reality precedes explanation. Daedalus must never explain what has not first been modelled.

## Shared platform direction

- Property is the root identity.
- Twin belongs to Property.
- Capture creates property-rooted Working Twins and Capture Sessions.
- Contracts defines shared schemas, boundaries, and validation language.
- Platform stores active Property, Twin, import metadata, and package objects.
- Main imports, validates, models, runs, and later explains the Twin.
- AI may improve readability only. It is not a source of truth.
- Users, billing, permissions, sync, and revenue models remain deferred.

## Current verified baseline

- Property-root contracts and canonical DaedalusPackage v4 authority.
- Fresh signed-device Capture to Platform to Main vertical spine.
- Main projections consume the same property-rooted Platform Twin state.
- Evidence class, uncertainty, provenance, and candidate state remain visible.
- Current Twin refinements and clone change sets are version-bound and traceable.
- Place contexts and multi-domain component projections remain non-authoritative.
- Signed-device multi-domain evidence preserves room context, evidence, Basin and Tap semantics, and domain projections through Platform into Main.
- Main executes a bounded Working System path through the existing kernel and preserves observed evidence, physical-model output, inferred service audits, assumptions, unknowns, and unsupported boundaries.
- Contracts 1.2.0 defines the provider-neutral Run shape and Main validates its output against it.

## Completed gate: Working System and Run contract

1. Main runs boiler to pump to open control valve to distribution pipe to radiator and zone service.
2. The observed boiler value remains evidence; solver-produced physical states are scientifically modelled; topology and service conclusions remain inferred; unavailable inputs remain unknown.
3. Modelled output uses real values and explicit mathematical physics wherever evidence permits.
4. The Run is immutable, non-authoritative, cannot overwrite the Current Twin, and generates no explanation.
5. Structural service success is not published as grounded success unless the physical model reaches the declared endpoint.

## Current tranche: Grounded explanation and correction

- Build explanations only from the demonstrated Working System inputs, events, transitions, modelled outputs, unknowns, and unsupported boundaries.
- Distinguish observations, customer statements, surveyor statements, measurements, calculations, assumptions, model inferences, and expert corrections.
- Turn bounded corrections into synthetic or minimised regression candidates.
- Generated language remains downstream of Reality to Analysis to Explanation and can never become Twin truth.

## Hard boundaries

- Capture observes reality; it does not own model reasoning, score, rank, recommend, price, or select products.
- Contracts defines declarative reality, Run boundaries, and validation; it does not execute scientific models.
- Platform stores and exposes canonical state; it does not own reasoning or model execution.
- Main owns reasoning and scientific physical/service models; it must preserve uncertainty and cannot recommend or rank choices.
- Sandbox is a disposable visual projection and is not architectural authority.

## Deferred explicitly

- User accounts, roles, permissions, billing, and subscriptions.
- Enterprise hierarchy and sync engine.
- Provider-specific AI extraction.
- Recommendations, product selection, pricing, and sales logic.
- Compliance or legal judgement.

## Current operational gate

The current gate is grounded explanation of the completed Working System Run. Explanation must show what the scientific model demonstrated and must not replace, invent, or overwrite the model or Twin.
`;

export function renderBuildPlanMarkdown(markdown) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  const output = [];
  let listType = null;
  let inCodeBlock = false;
  let codeLines = [];

  const closeList = () => {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      closeList();
      if (inCodeBlock) {
        output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = line.match(/^\s*-\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const requiredType = unordered ? "ul" : "ol";
      if (listType !== requiredType) {
        closeList();
        listType = requiredType;
        output.push(`<${listType}>`);
      }
      output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      continue;
    }

    closeList();
    if (!line.trim()) continue;

    if (line.startsWith("> ")) {
      output.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      continue;
    }

    output.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeList();
  if (inCodeBlock && codeLines.length) {
    output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }
  return output.join("\n");
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
