<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Message
 * @package App\Models
 * @property int $id
 * @property int $user_id
 * @property int $group_id
 * @property string $text
 * @property string $created_at
 * @property User $user
 * @property Group $group
 */
class Message extends Model
{
    /**
     * Message owner (group).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function group()
    {
        return $this->belongsTo('App\Models\Group');
    }

    /**
     * Message owner.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
