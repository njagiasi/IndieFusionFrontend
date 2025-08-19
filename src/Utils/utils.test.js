import { capitalizeParagraph, getIsImageFormat, getMemberFromMembers, VIDEO_FORMATS } from "./utils";
import { openToast } from './utils';
import { toast } from 'react-toastify';

describe('getIsImageFormat', () => {
  it('should return false for video formats', () => {
    expect(getIsImageFormat('file.mp4')).toBe(false);
    expect(getIsImageFormat('file.mov')).toBe(false);
  });

  it('should return true for non-video formats', () => {
    expect(getIsImageFormat('file.jpg')).toBe(true);
    expect(getIsImageFormat('file.png')).toBe(true);
    expect(getIsImageFormat('file.gif')).toBe(true);
  });
});

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('openToast', () => {
  it('should call toast.error when isError is true', () => {
    openToast('An error occurred', true);
    expect(toast.error).toHaveBeenCalledWith('An error occurred', expect.objectContaining({ theme: 'dark' }));
  });

  it('should call toast.success when isError is false', () => {
    openToast('Operation successful', false);
    expect(toast.success).toHaveBeenCalledWith('Operation successful', expect.objectContaining({ theme: 'dark' }));
  });
});


describe('getMemberFromMembers', () => {
  beforeEach(() => {
    localStorage.setItem('USER_ID', 'user123');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return the member with the matching userId', () => {
    const members = [
      { userId: 'user123', name: 'John Doe' },
      { userId: 'user456', name: 'Jane Doe' },
    ];
    expect(getMemberFromMembers(members)).toEqual({ userId: 'user123', name: 'John Doe' });
  });

  it('should return undefined if no matching member is found', () => {
    const members = [
      { userId: 'user456', name: 'Jane Doe' },
    ];
    expect(getMemberFromMembers(members)).toBeUndefined();
  });

  it('should return undefined if no members are passed', () => {
    expect(getMemberFromMembers()).toBeUndefined();
  });
});


describe('capitalizeParagraph', () => {
  it('should capitalize the first letter of each sentence', () => {
    const paragraph = 'hello. this is a test. how are you?';
    const result = capitalizeParagraph(paragraph);
    expect(result).toBe('Hello.This is a test.How are you?');
  });

  it('should handle empty strings gracefully', () => {
    expect(capitalizeParagraph('')).toBe('');
  });

  it('should not alter already capitalized sentences', () => {
    const paragraph = 'Hello. This is a test.';
    const result = capitalizeParagraph(paragraph);
    expect(result).toBe('Hello.This is a test.');
  });

  it('should correctly handle punctuation marks', () => {
    const paragraph = 'hello! how are you? what\'s up?';
    const result = capitalizeParagraph(paragraph);
    expect(result).toBe('Hello!How are you?What\'s up?');
  });
});

describe('VIDEO_FORMATS', () => {
  it('should contain mp4 and mov', () => {
    expect(VIDEO_FORMATS).toContain('mp4');
    expect(VIDEO_FORMATS).toContain('mov');
  });
});



