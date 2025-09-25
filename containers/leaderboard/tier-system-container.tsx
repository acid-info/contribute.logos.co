import { Typography } from '@acid-info/lsd-react'

export default function TierSystemContainer() {
  return (
    <div className="mt-12 space-y-6">
      <div className="mb-8 text-center">
        <Typography variant="h2" className="mb-2 !text-2xl">
          Contributor Tier System
        </Typography>
        <Typography variant="body2">
          <em>Note: Tiers are only applicable to All-Time Rankings</em>
        </Typography>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Explorer */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              1) Explorer
            </Typography>
            <Typography variant="body2" className="italic">
              (onboarded contributor)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> first accepted contribution in <em>any</em> track.
            </div>
            <div>
              <strong>Privileges:</strong> profile on the leaderboard; access to contributor
              channels.
            </div>
            <div>
              <strong>Expectations:</strong> follow CoC, ship at least 1 contribution/month.
            </div>
          </div>
        </div>

        {/* Builder */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              2) Builder
            </Typography>
            <Typography variant="body2" className="italic">
              (consistent contributor)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> 50+ points and 3+ accepted contributions
            </div>
            <div>
              <strong>Privileges:</strong> Receive Logos SWAG, can co-host community calls, can
              mentor Explorers.
            </div>
            <div>
              <strong>Expectations:</strong> quality, responsiveness in reviews/issues.
            </div>
          </div>
        </div>

        {/* Champion */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              3) Champion
            </Typography>
            <Typography variant="body2" className="italic">
              (area reviewer / content or design lead)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> appointed by maintainers(CCs + Governors) after showing
              review maturity.
            </div>
            <div>
              <strong>Privileges:</strong> reviewer permissions (approve PRs/docs in scoped areas);
              run working groups.
            </div>
            <div>
              <strong>Expectations:</strong> active reviewing; uphold standards; guide roadmaps.
            </div>
          </div>
        </div>

        {/* Governor */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              4) Governor
            </Typography>
            <Typography variant="body2" className="italic">
              (approver/maintainer equivalent)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> nominated by Councils after sustained impact and
              reliability.
            </div>
            <div>
              <strong>Privileges:</strong> merge/approve in scope, start initiatives, snapshot
              proposals access.
            </div>
            <div>
              <strong>Expectations:</strong> governance participation, succession planning, incident
              stewardship.
            </div>
          </div>
        </div>

        {/* Council */}
        <div className="border-primary border p-6 md:col-span-2 lg:col-span-1">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              5) Council
            </Typography>
            <Typography variant="body2" className="italic">
              (core decision-maker)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> elected from the community, time-boxed term
            </div>
            <div>
              <strong>Privileges:</strong> final say on tier promotions, sets seasonal themes and
              weighting, convenes town halls.
            </div>
            <div>
              <strong>Expectations:</strong> transparency, publish quarterly contributor report
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
