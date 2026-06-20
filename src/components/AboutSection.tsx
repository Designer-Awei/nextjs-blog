"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, Card, Col, Row, Statistic, Tag } from "antd";
import {
  Edit3,
  GitHub,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from "react-feather";
import type { Author } from "@/types";
import { UNSPLASH } from "@/lib/unsplash";
import { AuthorEditPanel } from "./AuthorEditPanel";
import { AvatarUploader } from "./AvatarUploader";

interface AboutSectionProps {
  /** 作者个人信息 */
  author: Author;
  /** 已发布文章数量 */
  articleCount: number;
}

/**
 * 关于我 — 站酷风格卡片布局
 */
export function AboutSection({ author, articleCount }: AboutSectionProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <section id="about" className="bg-surface py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Profile
              </p>
              <h2 className="text-display text-foreground">关于我</h2>
            </div>
            <Button
              icon={<Edit3 size={14} />}
              onClick={() => setEditOpen(true)}
            >
              编辑资料
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card
                variant="borderless"
                className="!shadow-[var(--card-shadow)]"
                cover={
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={UNSPLASH.covers.about}
                      alt="关于我"
                      fill
                      className="object-cover"
                      sizes="800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                }
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <AvatarUploader
                    name={author.name}
                    avatar={author.avatar}
                    avatarUpdatedAt={author.avatarUpdatedAt}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {author.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted">
                      {author.title}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[#444]">
                      {author.bio}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card variant="borderless" className="!shadow-[var(--card-shadow)]">
                    <Statistic title="已发布文章" value={articleCount} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card variant="borderless" className="!shadow-[var(--card-shadow)]">
                    <Statistic
                      title="技能领域"
                      value={author.skills.length}
                      suffix="项"
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card
                    title="联系方式"
                    variant="borderless"
                    className="!shadow-[var(--card-shadow)]"
                  >
                    <ul className="space-y-3">
                      <ContactRow
                        icon={<MapPin size={15} />}
                        label="位置"
                        value={author.location}
                      />
                      <ContactRow
                        icon={<Mail size={15} />}
                        label="邮箱"
                        value={author.email}
                        href={author.email ? `mailto:${author.email}` : undefined}
                      />
                    </ul>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="社交账号"
                variant="borderless"
                className="!shadow-[var(--card-shadow)]"
              >
                <div className="flex flex-wrap gap-2">
                  {author.social.github && (
                    <SocialLink
                      href={author.social.github}
                      label="GitHub"
                      icon={<GitHub size={14} />}
                    />
                  )}
                  {author.social.twitter && (
                    <SocialLink
                      href={author.social.twitter}
                      label="Twitter"
                      icon={<Twitter size={14} />}
                    />
                  )}
                  {author.social.linkedin && (
                    <SocialLink
                      href={author.social.linkedin}
                      label="LinkedIn"
                      icon={<Linkedin size={14} />}
                    />
                  )}
                  {!author.social.github &&
                    !author.social.twitter &&
                    !author.social.linkedin &&
                    !author.social.xiaohongshu && (
                      <p className="text-sm text-muted">暂未添加社交链接</p>
                    )}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title="技能栈"
                variant="borderless"
                className="!shadow-[var(--card-shadow)]"
              >
                <div className="flex flex-wrap gap-2">
                  {author.skills.map((skill) => (
                    <Tag key={skill} color="gold">
                      {skill}
                    </Tag>
                  ))}
                  {author.skills.length === 0 && (
                    <p className="text-sm text-muted">暂未添加技能</p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <AuthorEditPanel
        author={author}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

/** 联系方式行 */
function ContactRow({ icon, label, value, href }: ContactRowProps) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-surface text-foreground">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 text-sm text-foreground">{value || "—"}</p>
      </div>
    </div>
  );

  if (href && value) {
    return (
      <li>
        <a href={href} className="block rounded-sm transition-colors hover:bg-surface">
          {content}
        </a>
      </li>
    );
  }

  return <li>{content}</li>;
}

interface SocialLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/** 社交链接 */
function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button icon={icon}>{label}</Button>
    </a>
  );
}
