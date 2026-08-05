export const canonicalBuildPlanPageUrl =
  "https://github.com/martinbibb-cmd/Daedalus-contracts/blob/main/DAEDALUS_BUILD_PLAN.md";

export const publishedBuildPlanCommit = "b906afa";

export const publishedBuildPlanProjection = `# Daedalus Build Plan

Status: Sandbox read-only projection

Authority: Daedalus-contracts/DAEDALUS_BUILD_PLAN.md

Last aligned canonical commit: \`b906afa\` on 2026-08-05

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

## Current tranche: Working System demonstration

1. Demonstrate a complete deterministic System Twin execution in Main from contract-backed Property/Twin evidence, components, relationships, controls, services, and explicit unknowns.
2. Run the physical or service model before building an explanation layer.
3. Expose model inputs, state transitions, calculated outputs, provenance, assumptions, and unsupported boundaries.
4. Keep observed, inferred, calculated, and simulated state separate.
5. A Run must not overwrite the Current Twin or turn a scenario into reality.
6. Reuse and consolidate the existing Main reasoning kernel and solvers. Do not create a second modelling subsystem.

## Following tranche: Behaviour and Run contract extraction

- Extract only provider-neutral state snapshots, timeline events, provenance, and validation boundaries proven necessary by the Working System demonstration.
- Keep deterministic model output separate from rendering and explanation state.
- Require confidence, assumptions, provenance, and unsupported-model boundaries.
- Do not encode recommendations, product ranking, quotations, or optimisation.

## Later tranche: Grounded explanation and correction

- Build explanations only from demonstrated Working System inputs, traces, transitions, and outputs.
- Distinguish observations, customer statements, surveyor statements, measurements, calculations, assumptions, model inferences, and expert corrections.
- Turn bounded corrections into synthetic or minimised regression candidates.
- Generated language remains downstream of Reality to Analysis to Explanation and can never become Twin truth.

## Hard boundaries

- Capture observes reality; it does not analyse, simulate, score, rank, recommend, price, or select products.
- Contracts defines declarative reality and validation; it does not simulate.
- Platform stores and exposes canonical state; it does not own reasoning.
- Main owns reasoning and physical or service models; it must preserve uncertainty and cannot recommend or rank choices.
- Sandbox is a disposable visual projection and is not architectural authority.

## Deferred explicitly

- User accounts, roles, permissions, billing, and subscriptions.
- Enterprise hierarchy and sync engine.
- Provider-specific AI extraction.
- Recommendations, product selection, pricing, and sales logic.
- Compliance or legal judgement.

## Current operational gate

The next gate is one complete deterministic Working System demonstration in Main. Behaviour and Run contract extraction, visual projection, and grounded explanation follow demonstrated model behaviour.
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
