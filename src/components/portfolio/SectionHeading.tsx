interface SectionHeadingProps {
  id?: string
  index: string
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ id, index, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <div className="section-heading__meta">
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  )
}
