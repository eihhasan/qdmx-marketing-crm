import React, { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Share2, ThumbsUp, Eye, Link as LinkIcon,
  ExternalLink, Globe, Linkedin, Facebook, Twitter, Instagram,
  Search, Filter, Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'LinkedIn': return <Linkedin className="w-4 h-4 text-[#0077b5]" />;
    case 'Facebook': return <Facebook className="w-4 h-4 text-[#1877F2]" />;
    case 'Twitter': return <Twitter className="w-4 h-4 text-[#1DA1F2]" />;
    case 'Instagram': return <Instagram className="w-4 h-4 text-[#E4405F]" />;
    default: return <Globe className="w-4 h-4 text-zinc-500" />;
  }
};

export default function Feeds() {
  const { feeds, leads, linkFeedToLead, setSelectedLeadId } = useCRMStore();
  const [filter, setFilter] = useState('All');
  const [linkingFeedId, setLinkingFeedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredFeeds = filter === 'All' ? feeds : feeds.filter(f => f.type === filter);

  const handleLinkLead = (feedId: string, leadId: string) => {
    linkFeedToLead(feedId, leadId);
    setLinkingFeedId(null);
  };

  const handleLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    navigate('/leads');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Content Feeds</h1>
          <p className="text-zinc-500 mt-1">Monitor social posts, blogs, and SEO pages linked to your student admission leads.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Social Post', 'Blog Article', 'SEO Page'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                filter === type
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeeds.map((feed) => (
          <div key={feed.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                    <PlatformIcon platform={feed.platform} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">{feed.platform}</p>
                    <p className="text-[10px] text-zinc-400">{format(new Date(feed.timestamp), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-zinc-50 border border-zinc-100 rounded-md text-[10px] font-medium text-zinc-500 uppercase tracking-wide">
                  {feed.type}
                </span>
              </div>

              <h3 className="font-bold text-zinc-900 mb-2 line-clamp-2">{feed.title}</h3>
              <p className="text-sm text-zinc-600 mb-4 line-clamp-3">{feed.content}</p>

              <a href={feed.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mb-6">
                View Original <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-4 py-3 border-t border-zinc-50">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-medium">{feed.metrics.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-medium">{feed.metrics.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-medium">{feed.metrics.shares.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50/50 p-4 border-t border-zinc-100 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Linked Leads</p>
                <button
                  onClick={() => navigate('/leads', { state: { feedId: feed.id } })}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                >
                  View {feed.linkedLeadIds.length} Leads <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
