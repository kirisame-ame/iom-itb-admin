<template>
  <div class="rich-editor-wrapper bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div ref="editorContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';
import { useStore } from 'vuex';
import { POST_ACTIVITY_IMAGE } from '@/store/upload.module';
import Swal from 'sweetalert2';

Quill.register('modules/blotFormatter', BlotFormatter);

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change'): void;
}>();

const store = useStore();
const editorContainer = ref<HTMLElement>();
let quill: Quill | null = null;
let isInternalChange = false;

const emitContent = () => {
  if (!quill) return;
  isInternalChange = true;
  emit('update:modelValue', quill.root.innerHTML);
  emit('change');
  setTimeout(() => { isInternalChange = false; }, 0);
};

const imageHandler = () => {
  Swal.fire({
    title: 'Tambah Gambar',
    html: `
      <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
        <div>
          <label style="font-size:13px;color:#6b7280;display:block;margin-bottom:4px">Upload dari komputer</label>
          <input id="swal-img-file" type="file" accept="image/*" style="font-size:13px;width:100%"/>
        </div>
        <div style="text-align:center;color:#9ca3af;font-size:12px">— atau —</div>
        <div>
          <label style="font-size:13px;color:#6b7280;display:block;margin-bottom:4px">URL Gambar</label>
          <input id="swal-img-url" type="text" placeholder="https://..." style="width:100%;padding:6px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:13px"/>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    confirmButtonColor: '#2563eb',
    cancelButtonText: 'Batal',
    preConfirm: async () => {
      const file = (document.getElementById('swal-img-file') as HTMLInputElement)?.files?.[0];
      const url = (document.getElementById('swal-img-url') as HTMLInputElement)?.value;
      if (file) return await store.dispatch(POST_ACTIVITY_IMAGE, file);
      if (url) {
        try {
          new URL(url);
          return url;
        } catch { Swal.showValidationMessage('URL tidak valid'); }
      } else {
        Swal.showValidationMessage('Pilih file atau masukkan URL');
      }
    }
  }).then(result => {
    if (result.isConfirmed && result.value && quill) {
      const range = quill.getSelection() ?? { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, 'image', result.value);
      quill.setSelection(range.index + 1, 0);
    }
  });
};

const videoHandler = () => {
  Swal.fire({
    title: 'Tambah Video YouTube',
    input: 'text',
    inputPlaceholder: 'https://youtube.com/watch?v=...',
    showCancelButton: true,
    confirmButtonText: 'Tambah',
    confirmButtonColor: '#2563eb',
    cancelButtonText: 'Batal',
    inputValidator: (value) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
      if (!youtubeRegex.test(value)) return 'URL YouTube tidak valid';
    }
  }).then(result => {
    if (result.isConfirmed && quill) {
      const range = quill.getSelection() ?? { index: quill.getLength(), length: 0 };
      const match = result.value.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
      if (match) {
        quill.insertEmbed(range.index, 'video', `https://www.youtube.com/embed/${match[1]}`);
        quill.setSelection(range.index + 1, 0);
      }
    }
  });
};

onMounted(() => {
  if (!editorContainer.value) return;

  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote'],
          [{ header: 1 }, { header: 2 }, { header: 3 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
      blotFormatter: {},
      history: { delay: 500, maxStack: 100, userOnly: true },
      keyboard: {
        bindings: {
          undo: { key: 'Z', shortKey: true, handler: () => (quill as any).history.undo() },
          redo: { key: 'Y', shortKey: true, handler: () => (quill as any).history.redo() },
        },
      },
    },
  });

  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue;
  }

  quill.on('text-change', () => {
    emitContent();
  });
});

watch(() => props.modelValue, (val) => {
  if (!quill || isInternalChange) return;
  if (quill.root.innerHTML !== val) {
    quill.root.innerHTML = val || '';
  }
});

onBeforeUnmount(() => {
  quill = null;
});
</script>

<style>
.rich-editor-wrapper .ql-container {
  min-height: 600px;
  font-size: 16px;
  border: none !important;
}
.rich-editor-wrapper .ql-toolbar {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
}
.rich-editor-wrapper .ql-editor {
  min-height: 600px;
  padding: 20px 24px;
  line-height: 1.7;
}
.rich-editor-wrapper .ql-editor img {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}
.rich-editor-wrapper .ql-editor p { margin-bottom: 1rem; }
.rich-editor-wrapper .ql-editor h1 { font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.rich-editor-wrapper .ql-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.rich-editor-wrapper .ql-editor h3 { font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.rich-editor-wrapper .ql-editor blockquote {
  border-left: 4px solid #003793;
  padding-left: 1rem;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
}
.rich-editor-wrapper .ql-editor a { color: #2563eb; text-decoration: underline; }
.rich-editor-wrapper .ql-editor .ql-video {
  width: 100%;
  aspect-ratio: 16/9;
  display: block;
  margin: 1rem 0;
}
</style>