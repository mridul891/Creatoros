import Image from "next/image"
import type { RefObject } from "react"

import type { MediaKitFormData } from "@/schemas/mediaKit"
import "@/styles/media-kit-preview.css"
import {
  formatCategoryLabel,
  formatCompactNumber,
  formatGenderSplit,
  formatHandle,
  formatUpdatedDate,
  getInitials,
  getInstagramUrl,
  parseCommaSeparatedValues,
} from "@/utils/mediaKitFormatters"
import {
  buildRateCards,
  buildRateInclusions,
  formatRateMoney,
} from "@/utils/mediaKitRateBreakdown"
import { getEngagementRate } from "@/utils/mediaKitStats"

function InclusionText({ html }: { html: string }) {
  const parts = html.split(/(<b>.*?<\/b>)/g).filter(Boolean)

  return (
    <>
      {parts.map((part) => {
        const boldMatch = part.match(/^<b>(.*?)<\/b>$/)
        if (boldMatch) {
          return <b key={part}>{boldMatch[1]}</b>
        }

        return <span key={part}>{part}</span>
      })}
    </>
  )
}

export type MediaKitPreviewContentProps = {
  data: MediaKitFormData
  updatedAt?: Date
  showPreviewLabel?: boolean
  kitRef?: RefObject<HTMLElement | null>
}

export function MediaKitPreviewContent({
  data,
  updatedAt,
  showPreviewLabel = false,
  kitRef,
}: MediaKitPreviewContentProps) {
  const { profile, stats, audience, work, rates, contactInfo } = data

  const name = profile.name.trim() || "Your name"
  const handle = profile.handle.trim()
  const tagline = profile.bio?.trim() ?? ""
  const category = profile.category
  const avatarUrl = profile.avatarUrl?.trim() ?? ""
  const initials = getInitials(name)

  const engagementRate = getEngagementRate(
    stats.followers,
    stats.avgLikes,
    stats.avgComments,
    stats.engagementRate
  )

  const genderSplit = formatGenderSplit(audience.womenPercentage)
  const audienceItems = [
    audience.topAgeGroups.trim()
      ? { value: audience.topAgeGroups.trim(), label: "Top age group" }
      : null,
    genderSplit ? { value: genderSplit, label: "Split" } : null,
    audience.cities.length
      ? { value: audience.cities.join(", "), label: "Top cities" }
      : null,
    audience.countries.length
      ? { value: audience.countries.join(", "), label: "Top countries" }
      : null,
  ].filter(Boolean) as Array<{ value: string; label: string }>

  const workItems = work.items.filter((item) => item.title.trim())
  const brands = parseCommaSeparatedValues(work.brandsWorkedWith)

  const rateCards = buildRateCards(rates)
  const deliverableTitles = rateCards.map((card) => card.title)
  const inclusions = buildRateInclusions(rates, deliverableTitles)

  const statItems = [
    {
      value: formatCompactNumber(stats.followers),
      label: "Followers",
    },
    {
      value: formatCompactNumber(stats.avgReelViews),
      label: "Avg reel views",
    },
    {
      value: engagementRate > 0 ? `${engagementRate.toFixed(1)}%` : "—",
      label: "Engagement",
    },
    {
      value: formatCompactNumber(stats.avgStoryViews),
      label: "Story views",
    },
  ]

  const contactItems = [
    {
      label: "Email",
      value: contactInfo.email.trim() || "your@email.com",
    },
    ...(contactInfo.phone?.trim()
      ? [{ label: "Phone", value: contactInfo.phone.trim() }]
      : []),
    {
      label: "Instagram",
      value: handle ? formatHandle(handle) : "—",
    },
  ]

  return (
    <div className="media-kit-preview">
      {showPreviewLabel ? (
        <p className="mb-3 font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.11em]">
          Preview — what a brand sees
        </p>
      ) : null}

      <article ref={kitRef} className="mk-kit">
        <header className="mk-hero">
          <div className="mk-who">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                width={64}
                height={64}
                className="mk-avatar"
                unoptimized
                crossOrigin="anonymous"
              />
            ) : initials ? (
              <div aria-hidden="true" className="mk-avatar-init">
                {initials}
              </div>
            ) : null}

            <div>
              <h2 className="mk-name">{name}</h2>
              <a
                className="mk-handle"
                href={getInstagramUrl(handle)}
                rel="noopener noreferrer"
                target="_blank"
              >
                {formatHandle(handle)}
              </a>
            </div>
          </div>

          {tagline ? <p className="mk-tagline">{tagline}</p> : null}

          <div className="mk-categories">
            <span className="mk-category">{formatCategoryLabel(category)}</span>
          </div>

          <div className="mk-stats">
            {statItems.map((item) => (
              <div key={item.label} className="mk-stat">
                <div className="mk-stat-value">{item.value}</div>
                <div className="mk-stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </header>

        {audienceItems.length > 0 ? (
          <section className="mk-section">
            <h3 className="mk-section-title">Audience</h3>
            <div className="mk-audience">
              {audienceItems.map((item) => (
                <div key={item.label}>
                  <div className="mk-audience-value">{item.value}</div>
                  <div className="mk-audience-label">{item.label}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {workItems.length > 0 ? (
          <section className="mk-section">
            <h3 className="mk-section-title">Recent work</h3>
            <div className="mk-works">
              {workItems.map((item) => {
                const content = (
                  <>
                    <div className="mk-work-title">{item.title}</div>
                    {item.views > 0 ? (
                      <div className="mk-work-views">
                        {formatCompactNumber(item.views)} views
                      </div>
                    ) : null}
                  </>
                )

                if (item.url.trim()) {
                  return (
                    <a
                      key={`${item.title}-${item.url}`}
                      className="mk-work-card"
                      href={item.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {content}
                    </a>
                  )
                }

                return (
                  <div key={item.title} className="mk-work-card">
                    {content}
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}

        {brands.length > 0 ? (
          <section className="mk-section">
            <h3 className="mk-section-title">Worked with</h3>
            <div className="mk-brands">
              {brands.map((brand) => (
                <span key={brand} className="mk-brand">
                  {brand}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {rateCards.length > 0 ? (
          <section className="mk-section">
            <h3 className="mk-section-title">Rate card</h3>
            <div className="mk-rate-grid">
              {rateCards.map((card) => (
                <div key={card.title} className="mk-rate-card">
                  <div className="mk-rate-title">{card.title}</div>
                  <div className="mk-rate-price">
                    {formatRateMoney(card.total, rates.currency)}
                  </div>

                  {card.addOnLines.length > 0 ? (
                    <div className="mk-rate-breakdown">
                      <div className="mk-rate-line">
                        <span>Base</span>
                        <span>
                          {formatRateMoney(card.base, rates.currency)}
                        </span>
                      </div>
                      {card.addOnLines.map((line) => (
                        <div key={line.label} className="mk-rate-line">
                          <span>{line.label}</span>
                          <span>
                            +{formatRateMoney(line.amount, rates.currency)}
                          </span>
                        </div>
                      ))}
                      <div className="mk-rate-line mk-rate-line-total">
                        <span>Total</span>
                        <span>
                          {formatRateMoney(card.total, rates.currency)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mk-rate-breakdown">
                      Organic posting only
                    </div>
                  )}
                </div>
              ))}
            </div>

            {inclusions.length > 0 ? (
              <div className="mk-inclusions">
                {inclusions.map((line, index) => (
                  <span key={line.html}>
                    {index > 0 ? <br /> : null}
                    <InclusionText html={line.html} />
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mk-contact">
          {contactItems.map((item) => (
            <div key={item.label}>
              <div className="mk-contact-label">{item.label}</div>
              <div className="mk-contact-value">{item.value}</div>
            </div>
          ))}
        </section>

        <footer className="mk-updated">
          <span>Updated {formatUpdatedDate(updatedAt ?? new Date())}</span>
          {contactInfo.website?.trim() ? (
            <span>{contactInfo.website.trim()}</span>
          ) : null}
        </footer>
      </article>
    </div>
  )
}
