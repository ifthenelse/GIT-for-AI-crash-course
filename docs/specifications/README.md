# Git course specifications

The local scope is approved. Implemented contracts are in
`packages/contracts/src/index.ts`; the executable catalog is in
`packages/course-content/src/`. Course version `1.0.0`, engine version `1`.

- [Architecture and implemented APIs](../architecture.md).
- [Initial topic map](../analysis/curriculum.md).
- [Window manager](../window-manager.md) and [timing and breaks](../timing-and-pauses.md).
- [Tests and limitations](../testing.md), [audits](../audits/README.md).
- [Hosting and publishing gates](../deployment.md).

The implemented rule awards 100 points for the first valid completion; 12
exercises complete a tier and unlock the next. Reset and undo do not revoke
results. Real providers require separate configuration; environment variables
do not automatically create accounts or services.
