"use client";

import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import Image from "next/image";
import { GripVertical, Pin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminToggle,
  ConfirmModal,
  Field,
  PageHeader,
  ProgressBar,
  SaveButton,
} from "@/components/admin/ui";
import { useAdminContent } from "@/contexts/AdminContentContext";
import { useToast } from "@/contexts/ToastContext";
import { useAdminItemEditor } from "@/hooks/useAdminDraft";
import { newId, uploadFile } from "@/lib/firebase/content-service";
import { getVideoThumbnailUrl } from "@/lib/video-url";
import type { VideoItem } from "@/lib/firebase/types";

const emptyVideo = (): VideoItem => ({
  id: newId("v"),
  title: "New video",
  description: "",
  views: 0,
  likes: 0,
  uploadedAt: new Date().toISOString().slice(0, 10),
  thumbUrl: "",
  thumbSeed: `seed-${Date.now()}`,
  category: "General",
  featured: false,
  pinned: false,
  order: 0,
});

export default function VideosManagerPage() {
  const { content, saveVideoItem, deleteVideoItem, reorderVideoItems, saveStatus } = useAdminContent();
  const { toast } = useToast();
  const { items, selectItem, draft: selected, setDraft: setSelected, clearDirty } = useAdminItemEditor(
    content.videos,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);

  const saving = saveStatus === "saving";
  const saved = saveStatus === "saved";

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const next = [...items];
    const [removed] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, removed);
    try {
      await reorderVideoItems(next);
      clearDirty();
      toast("Video order updated");
    } catch {
      toast("Reorder failed", "error");
    }
  };

  const saveCurrent = async () => {
    if (!selected) return;
    try {
      await saveVideoItem({ ...selected, order: items.findIndex((v) => v.id === selected.id) });
      clearDirty();
      toast("Video saved");
    } catch {
      toast("Save failed", "error");
    }
  };

  const addVideo = async () => {
    const v = { ...emptyVideo(), order: items.length };
    try {
      await saveVideoItem(v);
      selectItem(v.id);
      toast("Video added");
    } catch {
      toast("Add failed", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteVideoItem(deleteId);
      setDeleteId(null);
      toast("Video deleted");
    } catch {
      toast("Delete failed", "error");
    }
  };

  const thumb = (v: VideoItem) => getVideoThumbnailUrl(v);

  return (
    <div>
      <PageHeader
        title="Video Management"
        description="Add, edit, pin, and drag to reorder videos. Changes appear on the homepage instantly."
        action={
          <button
            type="button"
            onClick={addVideo}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-100"
          >
            <Plus className="h-4 w-4" /> Add video
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <AdminCard title="All videos" description="Drag to reorder">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="videos">
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {items.map((v, index) => (
                    <Draggable key={v.id} draggableId={v.id} index={index}>
                      {(drag) => (
                        <li
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-2 transition-colors ${selected?.id === v.id ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/[0.06] bg-black/30 hover:border-white/15"}`}
                          onClick={() => selectItem(v.id)}
                        >
                          <span {...drag.dragHandleProps} className="text-white/30">
                            <GripVertical className="h-4 w-4" />
                          </span>
                          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg">
                            <Image src={thumb(v)} alt="" fill className="object-cover" unoptimized={thumb(v).startsWith("http")} />
                          </div>
                          <span className="min-w-0 flex-1 truncate text-xs text-white/75">{v.title}</span>
                          {v.pinned && <Pin className="h-3 w-3 shrink-0 text-cyan-400" />}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </AdminCard>

        {selected ? (
          <AdminCard title="Edit video">
            <div className="mb-4 flex justify-end">
              <SaveButton onClick={saveCurrent} saving={saving} saved={saved} label="Save video" />
            </div>
            <div className="space-y-4">
              <Field label="Title">
                <AdminInput
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <AdminTextarea
                  value={selected.description}
                  onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                {selected.videoUrl?.includes("instagram.com") ? (
                  <Field
                    label="Statistika"
                    hint="Instagram videolar uchun ko‘rishlar va layklar avtomatik yuklanadi — bu yerda tahrirlash shart emas."
                  >
                    <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/55">
                      Oblojka, layklar va (mumkin bo‘lsa) ko‘rishlar Instagram’dan olinadi.
                    </p>
                  </Field>
                ) : (
                  <>
                    <Field label="Views">
                      <AdminInput
                        type="number"
                        value={selected.views}
                        onChange={(e) => setSelected({ ...selected, views: Number(e.target.value) })}
                      />
                    </Field>
                    <Field label="Likes">
                      <AdminInput
                        type="number"
                        value={selected.likes}
                        onChange={(e) => setSelected({ ...selected, likes: Number(e.target.value) })}
                      />
                    </Field>
                  </>
                )}
              </div>
              <Field label="Category">
                <AdminInput
                  value={selected.category}
                  onChange={(e) => setSelected({ ...selected, category: e.target.value })}
                />
              </Field>
              <Field label="Upload date">
                <AdminInput
                  type="date"
                  value={selected.uploadedAt}
                  onChange={(e) => setSelected({ ...selected, uploadedAt: e.target.value })}
                />
              </Field>
              <Field label="Video link (Instagram / YouTube)" hint="instagram.com/reel yoki youtube.com — oblojka avtomatik">
                <AdminInput
                  value={selected.videoUrl ?? ""}
                  onChange={(e) => setSelected({ ...selected, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </Field>
              <Field label="Thumbnail (ixtiyoriy — bo‘sh qoldirsangiz linkdan olinadi)">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadFile(`videos/${selected.id}-${file.name}`, file, setUploadPct);
                    setSelected({ ...selected, thumbUrl: url });
                    setUploadPct(0);
                  }}
                  className="text-sm text-white/50 file:mr-2 file:rounded-lg file:border-0 file:bg-violet-500/20 file:px-3 file:py-1.5 file:text-violet-100"
                />
                {uploadPct > 0 && <ProgressBar value={uploadPct} />}
              </Field>
              <AdminToggle
                label="Featured"
                checked={selected.featured}
                onChange={(featured) => setSelected({ ...selected, featured })}
              />
              <AdminToggle
                label="Pinned"
                checked={selected.pinned}
                onChange={(pinned) => setSelected({ ...selected, pinned })}
              />
              <button
                type="button"
                onClick={() => setDeleteId(selected.id)}
                className="flex items-center gap-2 text-sm text-red-300 hover:text-red-200"
              >
                <Trash2 className="h-4 w-4" /> Delete video
              </button>
            </div>
          </AdminCard>
        ) : (
          <AdminCard title="Select a video">Choose a video from the list or add a new one.</AdminCard>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete video?"
        message="This cannot be undone. The video will be removed from the live site."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
