/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from './client';
import type { Project, DashboardStats, BlogPost, ContactMessage, Feedback, VisitorRecord, VisitorStats, SiteSettings, AnalyticsEvent } from '@/types';

const EMPTY_DASHBOARD_STATS: DashboardStats = {
  totalProjects: 0,
  totalViews: 0,
  totalDownloads: 0,
  publishedProjects: 0,
  featuredProjects: 0,
  draftProjects: 0,
};

// ─── HELPER MAPPERS ─────────────────────────────────────────────────────────
function mapProjectDoc(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    coverImage: row.cover_image,
    galleryImages: row.gallery_images || [],
    zipFile: row.zip_file,
    zipFileName: row.zip_file_name,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    tags: row.tags || [],
    category: row.category,
    technologies: row.technologies || [],
    version: row.version,
    releaseDate: row.release_date,
    featured: row.featured,
    published: row.published,
    viewCount: row.view_count || 0,
    downloadCount: row.download_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBlogDoc(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    coverImage: row.cover_image,
    tags: row.tags || [],
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const getProjects = async (filters?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limitCount?: number;
}): Promise<Project[]> => {
  let query = supabase.from('projects').select('*');
  if (filters?.published !== undefined) query = query.eq('published', filters.published);
  if (filters?.featured !== undefined) query = query.eq('featured', filters.featured);
  if (filters?.category) query = query.eq('category', filters.category);
  query = query.order('created_at', { ascending: false });
  if (filters?.limitCount) query = query.limit(filters.limitCount);

  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return (data || []).map(mapProjectDoc);
};

export const getProjectBySlug = async (slug: string, options?: { publishedOnly?: boolean }): Promise<Project | null> => {
  const publishedOnly = options?.publishedOnly ?? true;
  let query = supabase.from('projects').select('*').eq('slug', slug);
  if (publishedOnly) query = query.eq('published', true);

  const { data, error } = await query.single();
  if (error || !data) return null;
  return mapProjectDoc(data);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapProjectDoc(data);
};

export const createProject = async (
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>
): Promise<string> => {
  const { data: inserted, error } = await supabase.from('projects').insert({
    title: data.title,
    slug: data.slug,
    short_description: data.shortDescription,
    long_description: data.longDescription,
    cover_image: data.coverImage,
    gallery_images: data.galleryImages,
    zip_file: data.zipFile,
    zip_file_name: data.zipFileName,
    github_url: data.githubUrl,
    demo_url: data.demoUrl,
    tags: data.tags,
    category: data.category,
    technologies: data.technologies,
    version: data.version,
    release_date: data.releaseDate,
    featured: data.featured,
    published: data.published,
    view_count: 0,
    download_count: 0
  }).select('id').single();

  if (error) throw error;
  return inserted.id;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
  const payload: any = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.shortDescription !== undefined) payload.short_description = data.shortDescription;
  if (data.longDescription !== undefined) payload.long_description = data.longDescription;
  if (data.coverImage !== undefined) payload.cover_image = data.coverImage;
  if (data.galleryImages !== undefined) payload.gallery_images = data.galleryImages;
  if (data.zipFile !== undefined) payload.zip_file = data.zipFile;
  if (data.zipFileName !== undefined) payload.zip_file_name = data.zipFileName;
  if (data.githubUrl !== undefined) payload.github_url = data.githubUrl;
  if (data.demoUrl !== undefined) payload.demo_url = data.demoUrl;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.category !== undefined) payload.category = data.category;
  if (data.technologies !== undefined) payload.technologies = data.technologies;
  if (data.version !== undefined) payload.version = data.version;
  if (data.releaseDate !== undefined) payload.release_date = data.releaseDate;
  if (data.featured !== undefined) payload.featured = data.featured;
  if (data.published !== undefined) payload.published = data.published;

  const { error } = await supabase.from('projects').update(payload).eq('id', id);
  if (error) throw error;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

export const incrementViewCount = async (id: string): Promise<void> => {
  await supabase.rpc('increment_project_counter', { project_id: id, counter: 'views' });
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
  await supabase.rpc('increment_project_counter', { project_id: id, counter: 'downloads' });
};

export const getAllSlugs = async (): Promise<string[]> => {
  const { data, error } = await supabase.from('projects').select('slug').eq('published', true);
  if (error || !data) return [];
  return data.map((d: any) => d.slug);
};

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'main').single();
  if (error || !data) return null;
  return {
    id: data.id,
    developerName: data.developer_name,
    developerTitle: data.developer_title,
    developerBio: data.developer_bio,
    developerAvatar: data.developer_avatar,
    githubUrl: data.github_url,
    linkedinUrl: data.linkedin_url,
    twitterUrl: data.twitter_url,
    email: data.email,
    websiteUrl: data.website_url,
    techStack: data.tech_stack || [],
    categories: data.categories || [],
    heroTitle: data.hero_title,
    heroSubtitle: data.hero_subtitle,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    ogImage: data.og_image,
    announcement: data.announcement,
    linesOfCode: data.lines_of_code,
    updatedAt: data.updated_at,
  };
};

export const updateSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  const payload: any = { updated_at: new Date().toISOString() };
  if (data.developerName !== undefined) payload.developer_name = data.developerName;
  if (data.developerTitle !== undefined) payload.developer_title = data.developerTitle;
  if (data.developerBio !== undefined) payload.developer_bio = data.developerBio;
  if (data.developerAvatar !== undefined) payload.developer_avatar = data.developerAvatar;
  if (data.githubUrl !== undefined) payload.github_url = data.githubUrl;
  if (data.linkedinUrl !== undefined) payload.linkedin_url = data.linkedinUrl;
  if (data.twitterUrl !== undefined) payload.twitter_url = data.twitterUrl;
  if (data.email !== undefined) payload.email = data.email;
  if (data.websiteUrl !== undefined) payload.website_url = data.websiteUrl;
  if (data.techStack !== undefined) payload.tech_stack = data.techStack;
  if (data.categories !== undefined) payload.categories = data.categories;
  if (data.heroTitle !== undefined) payload.hero_title = data.heroTitle;
  if (data.heroSubtitle !== undefined) payload.hero_subtitle = data.heroSubtitle;
  if (data.seoTitle !== undefined) payload.seo_title = data.seoTitle;
  if (data.seoDescription !== undefined) payload.seo_description = data.seoDescription;
  if (data.ogImage !== undefined) payload.og_image = data.ogImage;
  if (data.announcement !== undefined) payload.announcement = data.announcement;
  if (data.linesOfCode !== undefined) payload.lines_of_code = data.linesOfCode;

  const { error } = await supabase
    .from('settings')
    .upsert({ id: 'main', ...payload }, { onConflict: 'id' })
    .select('id')
    .single();
  if (error) throw error;
};

export const initSiteSettings = async (data: Omit<SiteSettings, 'id' | 'updatedAt'>): Promise<void> => {
  await updateSiteSettings(data);
};

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
export const recordAnalyticsEvent = async (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> => {
  const { error } = await supabase.from('analytics_events').insert({
    type: event.type,
    project_id: event.projectId,
    project_title: event.projectTitle,
    user_agent: event.userAgent
  });
  if (error) console.error('recordAnalyticsEvent error', error);
};

export const getAnalyticsEvents = async (limitCount = 100): Promise<AnalyticsEvent[]> => {
  const { data, error } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(limitCount);
  if (error) return [];
  return data.map((d: any) => ({
    id: d.id,
    type: d.type,
    projectId: d.project_id,
    projectTitle: d.project_title,
    timestamp: d.created_at,
    userAgent: d.user_agent,
  }));
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
export const getDashboardStats = async (options?: { includeDrafts?: boolean }): Promise<DashboardStats> => {
  const includeDrafts = options?.includeDrafts ?? false;
  let query = supabase.from('projects').select('published, featured, view_count, download_count');
  if (!includeDrafts) query = query.eq('published', true);

  const { data, error } = await query;
  if (error || !data) return EMPTY_DASHBOARD_STATS;

  let totalViews = 0; let totalDownloads = 0; let published = 0; let featured = 0; let drafts = 0;
  data.forEach((p: any) => {
    totalViews += p.view_count || 0;
    totalDownloads += p.download_count || 0;
    if (p.published) published++; else drafts++;
    if (p.featured) featured++;
  });

  return { totalProjects: data.length, totalViews, totalDownloads, publishedProjects: published, featuredProjects: featured, draftProjects: drafts };
};

// ─── SAFE WRAPPERS ───────────────────────────────────────────────────────────
export async function safeGetProjects(filters?: Parameters<typeof getProjects>[0]): Promise<Project[]> {
  try { return await getProjects(filters); } catch { return []; }
}
export async function safeGetSiteSettings(): Promise<SiteSettings | null> {
  try { return await getSiteSettings(); } catch { return null; }
}
export async function safeGetDashboardStats(): Promise<DashboardStats> {
  try { return await getDashboardStats(); } catch { return EMPTY_DASHBOARD_STATS; }
}
export async function safeGetProjectBySlug(slug: string): Promise<Project | null> {
  try { return await getProjectBySlug(slug, { publishedOnly: true }); } catch { return null; }
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────
export const getBlogPosts = async (publishedOnly = true): Promise<BlogPost[]> => {
  let query = supabase.from('blog').select('*').order('created_at', { ascending: false });
  if (publishedOnly) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) return [];
  return data.map(mapBlogDoc);
};

export async function safeGetBlogPosts(): Promise<BlogPost[]> {
  try { return await getBlogPosts(true); } catch { return []; }
}

export const getBlogPostBySlug = async (slug: string, publishedOnly = true): Promise<BlogPost | null> => {
  let query = supabase.from('blog').select('*').eq('slug', slug);
  if (publishedOnly) query = query.eq('published', true);
  const { data, error } = await query.single();
  if (error || !data) return null;
  return mapBlogDoc(data);
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase.from('blog').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapBlogDoc(data);
};

export const createBlogPost = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { data: inserted, error } = await supabase.from('blog').insert({
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    cover_image: data.coverImage,
    tags: data.tags,
    published: data.published
  }).select('id').single();
  if (error) throw error;
  return inserted.id;
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>): Promise<void> => {
  const payload: any = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.summary !== undefined) payload.summary = data.summary;
  if (data.content !== undefined) payload.content = data.content;
  if (data.coverImage !== undefined) payload.cover_image = data.coverImage;
  if (data.tags !== undefined) payload.tags = data.tags;
  if (data.published !== undefined) payload.published = data.published;
  
  const { error } = await supabase.from('blog').update(payload).eq('id', id);
  if (error) throw error;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('blog').delete().eq('id', id);
  if (error) throw error;
};

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
export const createContactMessage = async (data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<void> => {
  const { error } = await supabase.from('messages').insert({ ...data, read: false });
  if (error) throw error;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data.map((d: any) => ({
    id: d.id, name: d.name, email: d.email, subject: d.subject, message: d.message, read: d.read, createdAt: d.created_at
  }));
};

export const markMessageRead = async (id: string): Promise<void> => {
  await supabase.from('messages').update({ read: true }).eq('id', id);
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  await supabase.from('messages').delete().eq('id', id);
};

// ─── FEEDBACKS ────────────────────────────────────────────────────────────────
export const submitFeedback = async (data: Omit<Feedback, 'id' | 'createdAt' | 'read'>): Promise<void> => {
  const { error } = await supabase.from('feedbacks').insert({
    project_id: data.projectId,
    project_title: data.projectTitle,
    rating: data.rating,
    message: data.message,
    ip_hash: data.ipHash,
    read: false
  });
  if (error) throw error;
};

export const getFeedbacks = async (projectId?: string): Promise<Feedback[]> => {
  let query = supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  if (error) return [];
  return data.map((d: any) => ({
    id: d.id, projectId: d.project_id, projectTitle: d.project_title, rating: d.rating, message: d.message, ipHash: d.ip_hash, read: d.read, createdAt: d.created_at
  }));
};

export const checkFeedbackExists = async (projectId: string, ipHash: string): Promise<boolean> => {
  const { data, error } = await supabase.from('feedbacks').select('id').eq('project_id', projectId).eq('ip_hash', ipHash).limit(1);
  if (error || !data) return false;
  return data.length > 0;
};

export const markFeedbackRead = async (id: string): Promise<void> => {
  await supabase.from('feedbacks').update({ read: true }).eq('id', id);
};

export const deleteFeedback = async (id: string): Promise<void> => {
  await supabase.from('feedbacks').delete().eq('id', id);
};

// ─── VISITORS ─────────────────────────────────────────────────────────────────
export const getVisitorStats = async (): Promise<VisitorStats> => {
  const { data, error } = await supabase.rpc('analytics_summary');
  if (error || !data) return { totalVisits: 0, uniqueVisitors: 0 };
  const summary = Array.isArray(data) ? data[0] : data;
  return { totalVisits: summary?.total_visits || 0, uniqueVisitors: summary?.unique_visitors || 0 };
};

export const getRecentVisitors = async (limitCount = 50): Promise<VisitorRecord[]> => {
  const { data, error } = await supabase.rpc('recent_visitors', { result_limit: limitCount });
  if (error || !data) return [];
  return data.map((d: any) => ({
    ipHash: d.ip_hash,
    firstVisit: d.first_visit,
    lastVisit: d.last_visit,
    visitCount: Number(d.visit_count),
    userAgent: d.user_agent,
    pages: d.pages
  }));
};
