module IdHelper
  # unique ids
  def uid
    "uid#{SecureRandom.hex}"
  end
  
  # unique ids that re-generate the same as on previous calls
  def rid(prefix = '')
    page_hash = Digest::MD5.hexdigest(request.path)
    @rid_seq ||= 0
    @rid_seq += 1
    "rid#{page_hash}#{@rid_seq}"
  end
end