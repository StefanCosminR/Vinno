class AnnotationLayout {

    constructor(title, website, start_time, end_time, tags_list, description, images_list) {
        this.title = title;
        this.website = website;
        this.start_time = start_time;
        this.end_time = end_time;
        this.tags_list = tags_list;
        this.description = description;
        this.images_list = images_list
    }

    add_tag_to_tags_list(tag) {
        this.tags_list.append(tag);
    }

    add_image_to_images_list(image) {
        this.images_list.append(image);
    }
}